if auction.extensions.count = 0 then the auction should not be extended.

The function `canExtend` is asynchronous so if it is called without the await keyword it returns a promise. 

Hence if the condition is always evaluated to be true and the auction is extended.