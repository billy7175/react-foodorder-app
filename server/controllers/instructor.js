import User from "../models/user";
import Course from "../models/course"
import queryString from "query-string";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
  try {
    // 1. find user from db
    const user = await User.findById(req.auth._id).exec();
    // 2. if user dont have stripe_account_id yet, then create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "express" });
      // console.log('ACCOUNT => ', account.id)
      user.stripe_account_id = account.id;
      user.save();
    }
    // 3. create account link based on account id (for frontend to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    //   console.log(accountLink)
    // 4. pre-fill any info such as email (optional), then send url resposne to frontend
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    // 5. then send the account link as response to fronend
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERR ", err);
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    console.log("ACCOUNT => ", account);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.auth._id).select("-password").exec();
    console.log('currentIc')
    if (!user.role.includes("Instructor")) {
      console.log('강사 권한 X')
      return res.status(403);
    } else {
      console.log('강사 권한 O')
      res.json({ ok: true });
    }
  } catch (err) {
    console.log('강사조회 실패')
    console.log('#currentInstructor', err);
  }
};


export const instructorCourses = async (req, res) => {
  try {
    console.log(123123)
    console.log(req)
    const courses = await Course.find({ instructor: req.auth._id })
      .sort({ createdAt: -1 })
      .exec();

      console.log('#instructorCourses', courses)
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};
