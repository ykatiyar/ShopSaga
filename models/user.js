const mongoose = require('mongoose');
authy = require('authy')(process.env.TWILIO_API_KEY);
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    authyId: String,
    resetToken: String,
    resetTokenExpiration: Date,
    date_joined: {
        type: Date,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    }]
});


userSchema.methods.sendAuthyToken = function(cb) {
    var self = this;

    if (!self.authyId) {
        console.log(self)
        // Register this user if it's a new user
        authy.register_user(self.email, self.phone, '+91',
            function(err, response) {
            if (err || !response.user){ 
                console.log(err);
                return cb.call(self, err);
            }
            self.authyId = response.user.id;
            self.save(function(err, doc) {
                if (err || !doc) return cb.call(self, err);
                self = doc;
                sendToken();
            });
        });
    } else {
        // Otherwise send token to a known user
        sendToken();
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken() {
        authy.request_sms(self.authyId, true, function(err, response) {
            cb.call(self, err);
        });
    }
};

userSchema.methods.verifyAuthyToken = function(otp, cb) {
    const self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};


userSchema.methods.sendMessage =
  function(message, successCallback, errorCallback) {
      const self = this;
      const toNumber = `+${self.countryCode}${self.phone}`;

      twilioClient.messages.create({
          to: toNumber,
          from: config.twilioNumber,
          body: message,
      }).then(function() {
        successCallback();
      }).catch(function(err) {
        errorCallback(err);
      });
  };


module.exports = mongoose.model('User', userSchema)
