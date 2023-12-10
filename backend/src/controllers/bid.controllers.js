const { findUser, updateUser } = require("../services/user");
const { updateTrading, findTrading } = require("../services/trading");

exports.Sell = async(req, res) => {
    try {
        console.log(req.body);
        const { oldamount, latestamount, share, bid } = req.body;

        var newAmount =
            parseInt(latestamount) - parseInt(oldamount) * parseFloat(share);
        var result = (newAmount * 10) / 100;

        // Find the Trading document by its ID
        const user = await findUser({ _id: req.user.data[1] });

        // Add the charge to the trading's bidding array
        user.amount =
            parseInt(user.amount) + parseInt(latestamount) - parseInt(result);
        user.profit = parseInt(user.profit) + parseInt(newAmount);

        const existingBidIndex = user.bids.findIndex(
            (existingBid) => existingBid.tradingId === req.params.id
        );

        // Remove the existing bid at the specified index
        if (existingBidIndex !== -1 && user.bids[existingBidIndex].bid == bid) {
            // If an existing bid is found, update its values
            user.bids[existingBidIndex].share = (
                parseFloat(user.bids[existingBidIndex].share) - parseFloat(share)
            ).toFixed(2);
            user.bids[existingBidIndex].sold =
                user.bids[existingBidIndex].share > 0 ? false : true;
            // Mark the 'bids' array as modified
            user.markModified("bids");
        }

        // Save the updated trading document
        await updateUser({ _id: user._id }, user);

        res.status(200).json({
            message: "Sell Bid successfully",
            amount: user?.amount,
            profit: user?.profit,
        });
    } catch (error) {
        console.error("failed:", error);
        res.status(500).json({ error: "failed" });
    }
};



exports.Bid = async(req, res) => {
    try {
        const { bid, amount, bidamount } = req.body;

        //console.log("bid:",bid,"  amount:",amount," bidamount:",bidamount);

        // Find the Trading document by its ID
        const trading = await findTrading({ _id: req.params.id });

        if (!trading) {
            return res.status(404).json({ error: "Trading not found" });
        }

        var share = (parseFloat(bidamount) / parseFloat(amount)).toFixed(2);

        // Add the charge to the trading's bidding array
        trading.bids.push({
            bid: bid,
            share: share,
            oldamount: amount,
            bidamount: bidamount,
            userId: req.user.data[1],
        });
        
        // Save the updated trading document
        const result = await updateTrading({ _id: trading._id }, trading);
        //console.log("This is the result:", result)

        // Find the Trading document by its ID
        const user = await findUser({ _id: req.user.data[1] });

        //Add the charge to the trading's bidding array
        user.amount = parseInt(user.amount) - parseInt(bidamount);

        //console.log("This is the user amount ", user.amount);
        
        //console.log("This is the req params", req.params.id, "this is the req body bid ", req.body.bid);

        //console.log("this is the req paramsid", req.params);
        const existingBidIndex = user.bids.findIndex(
            (existingBid) =>
            String(existingBid.tradingId) === String(req.params.id) &&
            String(existingBid.bid) === String(req.body.bid)
        );
        console.log("this is the existingBidIndex = ", existingBidIndex);


        if (existingBidIndex !== -1 && user.bids[existingBidIndex].bid == bid) {
            // If an existing bid is found, update its values
            console.log("I am now in if block");

            user.bids[existingBidIndex].share = (
                parseFloat(user.bids[existingBidIndex].share) + parseFloat(share)
            ).toFixed(2);

            
            user.bids[existingBidIndex].oldamount = (
                    (parseFloat(user.bids[existingBidIndex].oldamount) +
                        parseFloat(amount)) /
                    2
                )
                .toFixed(2)
                .toString();


            user.bids[existingBidIndex].bidamount = (
                parseFloat(user.bids[existingBidIndex].bidamount) +
                parseFloat(bidamount)
            ).toString();


            // Mark the 'bids' array as modified
            user.markModified("bids");
        } else {
            // If no existing bid is found, push a new bid
            user.bids.push({
                bid: bid,
                share: share,
                oldamount: amount,
                bidamount: bidamount,
                tradingId: trading.id,
                tradingName: trading.title,
                sold: false,
            });
            console.log("this is user.bids ",user.bids)
        }
        // Save the updated trading documen
       // console.log("THis is the user: ", user);
        const newUserresult = await updateUser({ _id: user._id }, user);

       // console.log("This is the new user updating:", newUserresult);

        res.status(200).json({ message: "Bid Placed successfully", amount });


    } catch (error) {
        console.error("Payment failed:", error);
        res.status(500).json({ error: "Payment failed" });
    }
};