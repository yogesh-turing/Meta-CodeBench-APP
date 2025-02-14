const { getChangedFields } = require('./alternate_responses/incorrect_solution');

// Unit test
const mongoose = require("mongoose");
const moment = require("moment");

describe("getChangedFields", () => {
  let oldDocument;
  const userId = new mongoose.Types.ObjectId();
  const friendId = new mongoose.Types.ObjectId();

  const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    isActive: Boolean,
    address: {
      street: String,
      city: String,
      residenceType: {
        residential: Boolean,
      },
      residenceChanges: [
        {
          street: String,
          city: String,
          residenceType: {
            residential: Boolean,
          },
        },
      ],
    },
    skills: [String],
    preferences: {
      theme: String,
      notifications: Boolean,
    },
    userId: mongoose.Schema.Types.ObjectId,
    friend: mongoose.Schema.Types.ObjectId,
    otherId: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    lastLoginDate: Date,
    bio: String,
    profile: mongoose.Schema.Types.Mixed,
  });

  const User = mongoose.model("User", userSchema);

  beforeEach(() => {
    oldDocument = new User({
      name: "John Doe",
      age: 30,
      isActive: true,
      address: { street: "123 Main St", city: "Lagos" },
      skills: ["JavaScript", "Python", "React"],
      preferences: { theme: "dark", notifications: true },
      _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"),
      userId,
      friend: friendId,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-06-15"),
      lastLoginDate: new Date("2023-06-15"),
      bio: "Software Engineer",
      profile: null,
    });
  });

  test("should return empty object when no changes occur", () => {
    const newData = { ...oldDocument.toObject() };
    expect(getChangedFields(newData, oldDocument)).toEqual({});
  });

  test("should return empty object when nothing is passed in", () => {
    const newData = {};
    expect(getChangedFields(newData, oldDocument)).toEqual({});

    const newData1 = undefined;
    expect(getChangedFields(newData1, oldDocument, ["age"])).toEqual({});
  });

  test("should detect primitive value changes", () => {
    const newData = { ...oldDocument.toObject(), age: 35, isActive: false };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      age: { old: 30, new: 35 },
      isActive: { old: true, new: false },
    });
  });

  test("should detect nested object changes", () => {
    const newData = {
      ...oldDocument.toObject(),
      address: {
        street: "123 Main St",
        city: "Abuja",
        residenceType: { residential: true },
        residenceChanges: [
          {
            street: "1 Place",
            city: "The City",
            residenceType: {
              residential: false,
            },
          },
        ],
      },
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      address: {
        old: { street: "123 Main St", city: "Lagos", residenceChanges: [] },
        new: {
          street: "123 Main St",
          city: "Abuja",
          residenceType: { residential: true },
          residenceChanges: [
            {
              street: "1 Place",
              city: "The City",
              residenceType: {
                residential: false,
              },
            },
          ],
        },
      },
    });
  });

  test("should detect array changes and show added and/or removed", () => {
    const newData = {
      ...oldDocument.toObject(),
      skills: ["JavaScript", "Go", "React"],
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      skills: {
        removed: ["Python"],
        added: ["Go"],
      },
    });
  });

  test("should handle ID field comparison correctly when new ID is a string", () => {
    const newUserId = new mongoose.Types.ObjectId();

    const newData = {
      ...oldDocument.toObject(),
      userId: newUserId.toString(),
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      userId: {
        old: userId.toString(),
        new: newUserId.toString(),
      },
    });
  });

  test("should handle ID field comparison correctly when old ID is nothing", () => {
    const otherId = new mongoose.Types.ObjectId();

    const newData = {
      ...oldDocument.toObject(),
      otherId: otherId.toString(),
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      otherId: {
        old: undefined,
        new: otherId.toString(),
      },
    });
  });

  test("should handle ID field comparison correctly when new ID field does not end with id", () => {
    const newFriendId = new mongoose.Types.ObjectId();

    const newData = {
      ...oldDocument.toObject(),
      friend: newFriendId.toString(),
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      friend: {
        old: friendId.toString(),
        new: newFriendId.toString(),
      },
    });
  });

  test("should handle date field comparison that ends with 'date' correctly", () => {
    const newData = {
      ...oldDocument.toObject(),
      lastLoginDate: "2023-07-01",
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      lastLoginDate: {
        old: moment("2023-06-15").format("YYYY-MM-DD"),
        new: "2023-07-01",
      },
    });
  });

  test("should handle various formats of date field that ends with 'date' correctly", () => {
    const newData = {
      ...oldDocument.toObject(),
      lastLoginDate: "20240101",
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      lastLoginDate: {
        old: "2023-06-15",
        new: "2024-01-01",
      },
    });
  });

  test("should handle date field comparison that does not end with 'date' correctly", () => {
    const newData = {
      ...oldDocument.toObject(),
      updatedAt: "2023-07-01",
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      updatedAt: {
        old: moment("2023-06-15").format("YYYY-MM-DD"),
        new: "2023-07-01",
      },
    });
  });

  test("should detect changes from null to object", () => {
    const newData = {
      ...oldDocument.toObject(),
      profile: { github: "https://github.com/johndoe" },
    };
    expect(getChangedFields(newData, oldDocument)).toEqual({
      profile: {
        old: null,
        new: { github: "https://github.com/johndoe" },
      },
    });
  });

  test("should ignore undefined values", () => {
    const newData = { ...oldDocument.toObject(), bio: undefined };
    expect(getChangedFields(newData, oldDocument)).toEqual({});
  });

  test("should only check specific fields when provided", () => {
    const newData = {
      ...oldDocument.toObject(),
      age: 35,
      bio: "Senior Software Engineer",
    };
    expect(getChangedFields(newData, oldDocument, ["age"])).toEqual({
      age: { old: 30, new: 35 },
    });
  });
});
