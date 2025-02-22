import { Texture } from '../../rendering/renderers/shared/texture/Texture.mjs';
import { UPDATE_PRIORITY } from '../../ticker/const.mjs';
import { Ticker } from '../../ticker/Ticker.mjs';
import { Sprite } from '../sprite/Sprite.mjs';

"use strict";
class AnimatedSprite extends Sprite {
  /** @ignore */
  constructor(...args) {
    let options = args[0];
    if (Array.isArray(args[0])) {
      options = {
        textures: args[0],
        autoUpdate: args[1]
      };
    }
    const { textures, autoUpdate, ...rest } = options;
    const [firstFrame] = textures;
    super({
      ...rest,
      texture: firstFrame instanceof Texture ? firstFrame : firstFrame.texture
    });
    this._textures = null;
    this._durations = null;
    this._autoUpdate = autoUpdate ?? true;
    this._isConnectedToTicker = false;
    this.animationSpeed = 1;
    this.loop = true;
    this.updateAnchor = false;
    this.onComplete = null;
    this.onFrameChange = null;
    this.onLoop = null;
    this._currentTime = 0;
    this._playing = false;
    this._previousFrame = null;
    this.textures = textures;
  }
  /** Stops the AnimatedSprite. */
  stop() {
    if (!this._playing) {
      return;
    }
    this._playing = false;
    if (this._autoUpdate && this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
  }
  /** Plays the AnimatedSprite. */
  play() {
    if (this._playing) {
      return;
    }
    this._playing = true;
    if (this._autoUpdate && !this._isConnectedToTicker) {
      Ticker.shared.add(this.update, this, UPDATE_PRIORITY.HIGH);
      this._isConnectedToTicker = true;
    }
  }
  /**
   * Stops the AnimatedSprite and goes to a specific frame.
   * @param frameNumber - Frame index to stop at.
   */
  gotoAndStop(frameNumber) {
    this.stop();
    this.currentFrame = frameNumber;
  }
  /**
   * Goes to a specific frame and begins playing the AnimatedSprite.
   * @param frameNumber - Frame index to start at.
   */
  gotoAndPlay(frameNumber) {
    this.currentFrame = frameNumber;
    this.play();
  }
  /**
   * Updates the object transform for rendering.
   * @param ticker - the ticker to use to update the object.
   */
  update(ticker) {
    if (!this._playing) {
      return;
    }
    const deltaTime = ticker.deltaTime;
    const elapsed = this.animationSpeed * deltaTime;
    const previousFrame = this.currentFrame;
    if (this._durations !== null) {
      let lag = this._currentTime % 1 * this._durations[this.currentFrame];
      lag += elapsed / 60 * 1e3;
      while (lag < 0) {
        this._currentTime--;
        lag += this._durations[this.currentFrame];
      }
      const sign = Math.sign(this.animationSpeed * deltaTime);
      this._currentTime = Math.floor(this._currentTime);
      while (lag >= this._durations[this.currentFrame]) {
        lag -= this._durations[this.currentFrame] * sign;
        this._currentTime += sign;
      }
      this._currentTime += lag / this._durations[this.currentFrame];
    } else {
      this._currentTime += elapsed;
    }
    if (this._currentTime < 0 && !this.loop) {
      this.gotoAndStop(0);
      if (this.onComplete) {
        this.onComplete();
      }
    } else if (this._currentTime >= this._textures.length && !this.loop) {
      this.gotoAndStop(this._textures.length - 1);
      if (this.onComplete) {
        this.onComplete();
      }
    } else if (previousFrame !== this.currentFrame) {
      if (this.loop && this.onLoop) {
        if (this.animationSpeed > 0 && this.currentFrame < previousFrame || this.animationSpeed < 0 && this.currentFrame > previousFrame) {
          this.onLoop();
        }
      }
      this._updateTexture();
    }
  }
  /** Updates the displayed texture to match the current frame index. */
  _updateTexture() {
    const currentFrame = this.currentFrame;
    if (this._previousFrame === currentFrame) {
      return;
    }
    this._previousFrame = currentFrame;
    this.texture = this._textures[currentFrame];
    if (this.updateAnchor) {
      this.anchor.copyFrom(this.texture.defaultAnchor);
    }
    if (this.onFrameChange) {
      this.onFrameChange(this.currentFrame);
    }
  }
  /** Stops the AnimatedSprite and destroys it. */
  destroy() {
    this.stop();
    super.destroy();
    this.onComplete = null;
    this.onFrameChange = null;
    this.onLoop = null;
  }
  /**
   * A short hand way of creating an AnimatedSprite from an array of frame ids.
   * @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
   * @returns - The new animated sprite with the specified frames.
   */
  static fromFrames(frames) {
    const textures = [];
    for (let i = 0; i < frames.length; ++i) {
      textures.push(Texture.from(frames[i]));
    }
    return new AnimatedSprite(textures);
  }
  /**
   * A short hand way of creating an AnimatedSprite from an array of image ids.
   * @param images - The array of image urls the AnimatedSprite will use as its texture frames.
   * @returns The new animate sprite with the specified images as frames.
   */
  static fromImages(images) {
    const textures = [];
    for (let i = 0; i < images.length; ++i) {
      textures.push(Texture.from(images[i]));
    }
    return new AnimatedSprite(textures);
  }
  /**
   * The total number of frames in the AnimatedSprite. This is the same as number of textures
   * assigned to the AnimatedSprite.
   * @readonly
   * @default 0
   */
  get totalFrames() {
    return this._textures.length;
  }
  /** The array of textures used for this AnimatedSprite. */
  get textures() {
    return this._textures;
  }
  set textures(value) {
    if (value[0] instanceof Texture) {
      this._textures = value;
      this._durations = null;
    } else {
      this._textures = [];
      this._durations = [];
      for (let i = 0; i < value.length; i++) {
        this._textures.push(value[i].texture);
        this._durations.push(value[i].time);
      }
    }
    this._previousFrame = null;
    this.gotoAndStop(0);
    this._updateTexture();
  }
  /** The AnimatedSprite's current frame index. */
  get currentFrame() {
    let currentFrame = Math.floor(this._currentTime) % this._textures.length;
    if (currentFrame < 0) {
      currentFrame += this._textures.length;
    }
    return currentFrame;
  }
  set currentFrame(value) {
    if (value < 0 || value > this.totalFrames - 1) {
      throw new Error(`[AnimatedSprite]: Invalid frame index value ${value}, expected to be between 0 and totalFrames ${this.totalFrames}.`);
    }
    const previousFrame = this.currentFrame;
    this._currentTime = value;
    if (previousFrame !== this.currentFrame) {
      this._updateTexture();
    }
  }
  /**
   * Indicates if the AnimatedSprite is currently playing.
   * @readonly
   */
  get playing() {
    return this._playing;
  }
  /** Whether to use Ticker.shared to auto update animation time. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(value) {
    if (value !== this._autoUpdate) {
      this._autoUpdate = value;
      if (!this._autoUpdate && this._isConnectedToTicker) {
        Ticker.shared.remove(this.update, this);
        this._isConnectedToTicker = false;
      } else if (this._autoUpdate && !this._isConnectedToTicker && this._playing) {
        Ticker.shared.add(this.update, this);
        this._isConnectedToTicker = true;
      }
    }
  }
}

export { AnimatedSprite };
//# sourceMappingURL=AnimatedSprite.mjs.map
