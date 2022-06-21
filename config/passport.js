const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../model/userModel')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/users/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // const newUser = {
        //   googleId: profile.id,
        //   displayName: profile.displayName,
        //   firstName: profile.name.givenName,
        //   lastName: profile.name.familyName,
        //   email: profile.emails[0].value,
        //   image: profile.photos[0].value
        // }

        try {
            const user = await User.findOne({ email: profile.emails[0].value })
            if (user && user.google_id =="") {
                await User.findByIdAndUpdate(user.id,{google_id:profile.id})
            }
            if (user && user.profile =="") {
                await User.findByIdAndUpdate(user.id,{profile:profile.photos[0].value})
            }
            done(null, user)
        } catch (err) {
          console.error(err)
          
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    done(null, id)
    User.findById(id, (err, user) => done(err, user))
  })

}