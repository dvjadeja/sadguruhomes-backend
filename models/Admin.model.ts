import { model, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    name: String,
    email: String,
    phone: {
      type: String,
      required: [true, "Phone no is Required"],
      unique: true,
    },
    password: String,
  },
  {
    timestamps: true,
  }
);

const AdminModel = model("Admin", adminSchema);

export default AdminModel;
