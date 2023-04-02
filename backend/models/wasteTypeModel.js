import mongoose from "mongoose";

const wasteTypeSchema =  mongoose.Schema({
    wasteType: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "default.jpg", // Set default value to "default.jpg"
    },
    recyclingInstructions: {
      type: String,
      required: true,
    },
    environmentalImpact: {
      type: String,
      required: true,
    },
  });
  
  const WasteType = mongoose.model("WasteType", wasteTypeSchema);
  
  export default WasteType;