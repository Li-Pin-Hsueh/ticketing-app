import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the props
// that create a new user has
interface UserAttrs {
  email: string;
  password: string;
}

// An interface describes User Model
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the props
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.password;
      delete ret._id;
    },
    // remove the __v prop
    versionKey: false,
  }
});

userSchema.pre("save", async function(done) {
  // Create new user is a MODIFY-event
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// example for creating a new User::

// const user = User.build({
//   email: "Test@app.io",
//   password: "test1234",
//   x: 1,
// });

export { User };
