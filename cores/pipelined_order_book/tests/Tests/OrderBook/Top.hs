module Tests.OrderBook.Top where

import Clash.Hedgehog.Sized.Unsigned
import qualified Clash.Prelude as C
import qualified Hedgehog as H
import qualified Hedgehog.Gen as Gen
import qualified Hedgehog.Range as Range
import Test.Tasty
import Test.Tasty.Hedgehog
import Test.Tasty.TH
import Prelude

-- dummy hedgehog property
prop :: H.Property
prop =
  H.property $ do
    let
    (1 :: Integer) H.=== (1 :: Integer)

tests :: TestTree
tests = $(testGroupGenerator)

main :: IO ()
main = defaultMain tests
