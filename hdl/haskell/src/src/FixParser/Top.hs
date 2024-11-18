{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE TypeFamilies #-}

module FixParser where

import Clash.Prelude
import Data.Char (ord)

type MaxTagLength = 5

type MaxValueLength = 64

type MaxNumTags = 64

type Byte = Unsigned 8

type Tag = Unsigned 16 -- Tag numbers up to 65535

type TagDigits = Vec MaxTagLength Byte

data ParserState
  = WaitingForTag
  | ReadingTag
  | ReadingValue
  | ValidatingChecksum
  | MessageComplete
  | ErrorState ErrorType
  deriving (Generic, NFDataX, Show, Eq)

data ErrorType
  = InvalidTag
  | InvalidValue
  | ChecksumMismatch
  | UnexpectedByte
  | MalformedMessage
  | BufferOverflow
  deriving (Generic, NFDataX, Show, Eq)

data ParserOutput
  = ParsedMessage MessageData
  | ParserError ErrorType
  deriving (Generic, NFDataX, Show)

newtype Value = Value (Vec MaxValueLength Byte)
  deriving (Generic, NFDataX, Show)

newtype MessageData = MessageData
  { tags :: Vec MaxNumTags (Tag, Value)
  }
  deriving (Generic, NFDataX, Show)

data ParserData = ParserData
  { tagDigits :: Vec MaxTagLength Byte,
    tagDigitIndex :: Index MaxTagLength,
    currentTag :: Tag,
    valueBytes :: Vec MaxValueLength Byte,
    valueByteIndex :: Index MaxValueLength,
    tagsAccum :: Vec MaxNumTags (Tag, Value),
    tagIndex :: Index MaxNumTags,
    calcChecksum :: Unsigned 16, -- Accumulated checksum
    inMessage :: Bool -- Indicates whether we're in a message
  }
  deriving (Generic, NFDataX)

topEntity ::
  Clock System ->
  Reset System ->
  Enable System ->
  Signal System Byte ->
  Signal System (Maybe ParserOutput)
topEntity = exposeClockResetEnable parser
{-# ANN
  topEntity
  ( Synthesize
      { t_name = "FixParserTop",
        t_inputs =
          [ PortName "CLK",
            PortName "RST",
            PortName "EN",
            PortName "DIN"
          ],
        t_output = PortName "DOUT"
      }
  )
  #-}

parser ::
  (HiddenClockResetEnable dom) =>
  Signal dom Byte ->
  Signal dom (Maybe ParserOutput)
parser = mealy parserT initialState
  where
    initialState = (WaitingForTag, initialParserData)

initialParserData :: ParserData
initialParserData =
  ParserData
    { tagDigits = repeat 0,
      tagDigitIndex = 0,
      currentTag = 0,
      valueBytes = repeat 0,
      valueByteIndex = 0,
      tagsAccum = repeat (0, Value (repeat 0)),
      tagIndex = 0,
      calcChecksum = 0,
      inMessage = False
    }

parserT ::
  (ParserState, ParserData) ->
  Byte ->
  ((ParserState, ParserData), Maybe ParserOutput)
parserT (state, pdata@ParserData {..}) byte = case state of
  WaitingForTag ->
    if isDigitByte byte
      then
        let tagDigits' = replace 0 byte tagDigits
            pdata' =
              pdata
                { tagDigits = tagDigits',
                  tagDigitIndex = 1,
                  inMessage = True,
                  calcChecksum = if inMessage then calcChecksum + byte else byte
                }
         in ((ReadingTag, pdata'), Nothing)
      else ((WaitingForTag, pdata), Nothing)
  ReadingTag ->
    if isDigitByte byte
      then
        if tagDigitIndex < maxBound
          then
            let tagDigits' = replace tagDigitIndex byte tagDigits
                pdata' =
                  pdata
                    { tagDigits = tagDigits',
                      tagDigitIndex = tagDigitIndex + 1,
                      calcChecksum = calcChecksum + byte
                    }
             in ((ReadingTag, pdata'), Nothing)
          else ((ErrorState BufferOverflow, pdata), Just (ParserError BufferOverflow))
      else
        if byte == asciiOf '='
          then
            let tag = parseTag tagDigits tagDigitIndex
                pdata' =
                  pdata
                    { currentTag = tag,
                      tagDigits = repeat 0,
                      tagDigitIndex = 0,
                      calcChecksum = calcChecksum + byte
                    }
             in ((ReadingValue, pdata'), Nothing)
          else
            ((ErrorState InvalidTag, pdata), Just (ParserError InvalidTag))
  ReadingValue ->
    if byte == asciiSOH
      then
        let value = Value (take valueByteIndex valueBytes)
            tagsAccum' = replace tagIndex (currentTag, value) tagsAccum
            calcChecksum' = if currentTag == 10 then calcChecksum else calcChecksum + byte
            pdata' =
              pdata
                { tagsAccum = tagsAccum',
                  tagIndex = tagIndex + 1,
                  currentTag = 0,
                  valueBytes = repeat 0,
                  valueByteIndex = 0,
                  calcChecksum = calcChecksum'
                }
            nextState =
              if currentTag == 10
                then ValidatingChecksum
                else WaitingForTag
         in ((nextState, pdata'), Nothing)
      else
        if valueByteIndex < maxBound
          then
            let valueBytes' = replace valueByteIndex byte valueBytes
                calcChecksum' = if currentTag == 10 then calcChecksum else calcChecksum + byte
                pdata' =
                  pdata
                    { valueBytes = valueBytes',
                      valueByteIndex = valueByteIndex + 1,
                      calcChecksum = calcChecksum'
                    }
             in ((ReadingValue, pdata'), Nothing)
          else ((ErrorState BufferOverflow, pdata), Just (ParserError BufferOverflow))
  ValidatingChecksum ->
    let receivedChecksum = parseChecksum valueBytes valueByteIndex
        calculatedChecksum = calcChecksum `mod` 256
     in if receivedChecksum == calculatedChecksum
          then
            let message = MessageData {tags = take tagIndex tagsAccum}
             in ((MessageComplete, pdata), Just (ParsedMessage message))
          else ((ErrorState ChecksumMismatch, pdata), Just (ParserError ChecksumMismatch))
  MessageComplete ->
    let pdata' = initialParserData
     in ((WaitingForTag, pdata'), Nothing)
  ErrorState err ->
    ((ErrorState err, pdata), Just (ParserError err))

asciiOf :: Char -> Byte
asciiOf c = fromIntegral (ord c)

asciiSOH :: Byte
asciiSOH = 0x01 -- SOH character

isDigitByte :: Byte -> Bool
isDigitByte byte = byte >= asciiOf '0' && byte <= asciiOf '9'

parseTag :: Vec MaxTagLength Byte -> Index MaxTagLength -> Tag
parseTag tagDigits len =
  foldl (\acc d -> acc * 10 + fromIntegral (d - asciiOf '0')) 0 (take len tagDigits)

parseChecksum :: Vec MaxValueLength Byte -> Index MaxValueLength -> Unsigned 16
parseChecksum valueBytes len =
  foldl (\acc d -> acc * 10 + fromIntegral (d - asciiOf '0')) 0 (take len valueBytes)
