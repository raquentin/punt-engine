import Test.Tasty
import qualified Tests.Example.Project
import qualified Tests.OrderBook.Top
import Prelude

main :: IO ()
main =
  defaultMain $
    testGroup
      "."
      [ Tests.Example.Project.accumTests,
        Tests.OrderBook.Top.tests
      ]
