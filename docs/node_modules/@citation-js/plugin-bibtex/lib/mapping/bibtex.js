"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
var _bibtexTypes = _interopRequireDefault(require("./bibtexTypes.json"));
var _shared = require("./shared.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = new _core.util.Translator([{
  source: 'note',
  target: 'accessed',
  when: {
    source: false,
    target: {
      note: false
    }
  },
  convert: {
    toSource(accessed) {
      return `[Online; accessed ${(0, _date.format)(accessed)}]`;
    }
  }
}, {
  source: 'annote',
  target: 'annote'
}, {
  source: 'address',
  target: 'publisher-place',
  convert: _shared.Converters.PICK
}, {
  source: 'author',
  target: 'author',
  convert: _shared.Converters.NAMES
}, {
  source: 'chapter',
  target: 'chapter-number'
}, {
  source: 'number',
  target: 'collection-number',
  when: {
    source: {
      [_shared.TYPE]: ['book', 'mvbook', 'inbook', 'collection', 'mvcollection', 'incollection', 'suppcollection', 'manual', 'suppperiodical', 'proceedings', 'mvproceedings', 'refererence']
    },
    target: {
      type: ['bill', 'book', 'broadcast', 'chapter', 'dataset', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'figure', 'graphic', 'interview', 'legislation', 'legal_case', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'post', 'post-weblog', 'personal_communication', 'review', 'review-book', 'song', 'speech', 'thesis', 'treaty', 'webpage']
    }
  }
}, {
  source: 'series',
  target: 'collection-title'
}, {
  source: 'booktitle',
  target: 'container-title',
  when: {
    target: {
      type: ['chapter', 'paper-conference']
    }
  }
}, {
  source: 'journal',
  target: 'container-title',
  when: {
    source: {
      [_shared.TYPE]: 'article'
    },
    target: {
      type: ['article', 'article-newspaper', 'article-journal', 'article-magazine']
    }
  }
}, {
  source: 'doi',
  target: 'DOI'
}, {
  source: 'edition',
  target: 'edition'
}, {
  source: 'editor',
  target: 'editor',
  convert: _shared.Converters.NAMES
}, {
  source: _shared.LABEL,
  target: ['id', 'citation-key', 'author', 'issued', 'year-suffix', 'title'],
  convert: _shared.Converters.LABEL
}, {
  source: 'isbn',
  target: 'ISBN'
}, {
  source: 'issn',
  target: 'ISSN'
}, {
  source: 'number',
  target: 'issue',
  when: {
    source: {
      [_shared.TYPE]: ['article', 'periodical', 'inproceedings']
    },
    target: {
      issue(issue) {
        return typeof issue === 'number' || typeof issue === 'string' && issue.match(/\d+/);
      },
      type: ['article', 'article-journal', 'article-newspaper', 'article-magazine', 'paper-conference', 'periodical']
    }
  }
}, {
  source: ['year', 'month', 'day'],
  target: 'issued',
  convert: _shared.Converters.YEAR_MONTH
}, {
  source: 'note',
  target: 'note'
}, {
  source: 'number',
  target: 'number',
  when: {
    source: {
      [_shared.TYPE]: ['patent', 'report', 'techreport']
    },
    target: {
      type: ['patent', 'report']
    }
  }
}, {
  source: 'eid',
  target: 'number',
  when: {
    source: {
      number: false
    },
    target: {
      type: ['article-journal']
    }
  }
}, {
  source: 'pages',
  target: 'page',
  convert: _shared.Converters.PAGES
}, {
  source: 'publisher',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    target: {
      type: ['article', 'article-journal', 'article-magazine', 'article-newspaper', 'bill', 'book', 'broadcast', 'chapter', 'classic', 'collection', 'dataset', 'document', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'event', 'figure', 'graphic', 'hearing', 'interview', 'legal_case', 'legislation', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'patent', 'performance', 'periodical', 'personal_communication', 'post', 'post-weblog', 'regulation', 'review', 'review-book', 'software', 'song', 'speech', 'standard', 'treaty', 'webpage']
    }
  }
}, {
  source: 'organization',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false
    },
    target: {
      type: 'paper-conference'
    }
  }
}, {
  source: 'institution',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false,
      organization: false
    },
    target: {
      type: 'report'
    }
  }
}, {
  source: 'school',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      institution: false,
      organization: false,
      publisher: false
    },
    target: {
      type: 'thesis'
    }
  }
}, {
  source: 'howpublished',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      howpublished(howPublished) {
        return howPublished && !howPublished.startsWith('http');
      },
      publisher: false,
      organization: false,
      institution: false,
      school: false
    },
    target: {
      type: 'manuscript'
    }
  }
}, {
  source: 'title',
  target: 'title'
}, {
  source: [_shared.TYPE, 'type'],
  target: ['type', 'genre'],
  convert: {
    toTarget(sourceType, subType) {
      const type = _bibtexTypes.default.source[sourceType] || 'document';
      if (subType) {
        return [type, subType];
      } else if (sourceType === 'mastersthesis') {
        return [type, 'Master\'s thesis'];
      } else if (sourceType === 'phdthesis') {
        return [type, 'PhD thesis'];
      } else {
        return [type];
      }
    },
    toSource(targetType, genre) {
      const type = _bibtexTypes.default.target[targetType] || 'misc';
      if (/^(master'?s|diploma) thesis$/i.test(genre)) {
        return ['mastersthesis'];
      } else if (/^(phd|doctoral) thesis$/i.test(genre)) {
        return ['phdthesis'];
      } else {
        return [type, genre];
      }
    }
  }
}, {
  source: _shared.TYPE,
  when: {
    target: {
      type: false
    }
  },
  convert: {
    toSource() {
      return 'misc';
    }
  }
}, {
  source: 'url',
  target: 'URL'
}, {
  source: 'howpublished',
  target: 'URL',
  convert: _shared.Converters.HOW_PUBLISHED,
  when: {
    target: {
      publisher: false
    }
  }
}, {
  source: 'volume',
  target: 'volume'
}]);