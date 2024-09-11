const { MongoClient, ObjectId } = require("mongodb");

// MongoDB connection URL
const url = "mongodb://localhost:27017"; // Update this URL if MongoDB is hosted elsewhere
const dbName = "contact";

async function main() {
  const client = new MongoClient(url);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("contactlist");

    // Insert documents into the collection
    await collection.insertMany([
      { lastName: "Ben", firstName: "Moris", email: "ben@gmail.com", age: 26 },
      { lastName: "Kefi", firstName: "Seif", email: "kefi@gmail.com", age: 15 },
      {
        lastName: "Emilie",
        firstName: "Brouge",
        email: "emilie.b@gmail.com",
        age: 40,
      },
      { lastName: "Alex", firstName: "Brown", age: 4 },
      { lastName: "Denzel", firstName: "Washington", age: 3 },
    ]);
    console.log("Documents inserted");

    // 1. Display all contacts
    console.log("\nAll contacts:");
    let contacts = await collection.find().toArray();
    console.log(contacts);

    // 2. Display information about a single person using their ID
    let personId = contacts[0]._id; // Use the ID of the first contact
    console.log(`\nPerson with ID ${personId}:`);
    let person = await collection.findOne({ _id: ObjectId(personId) });
    console.log(person);

    // 3. Display contacts with an age > 18
    console.log("\nContacts with age > 18:");
    let ageGreaterThan18 = await collection
      .find({ age: { $gt: 18 } })
      .toArray();
    console.log(ageGreaterThan18);

    // 4. Display contacts with an age > 18 and name containing "ah"
    console.log("\nContacts with age > 18 and name containing 'ah':");
    let nameContainingAh = await collection
      .find({
        age: { $gt: 18 },
        $or: [{ firstName: /ah/i }, { lastName: /ah/i }],
      })
      .toArray();
    console.log(nameContainingAh);

    // 5. Change the contact's first name from "Kefi Seif" to "Kefi Anis"
    console.log("\nUpdating first name of 'Kefi Seif' to 'Kefi Anis'");
    await collection.updateOne(
      { firstName: "Seif", lastName: "Kefi" },
      { $set: { firstName: "Kefi Anis" } }
    );
    console.log("Name updated");

    // 6. Delete contacts aged under 5
    console.log("\nDeleting contacts with age < 5");
    await collection.deleteMany({ age: { $lt: 5 } });
    console.log("Deleted contacts aged under 5");

    // 7. Display all contacts again
    console.log("\nAll contacts after updates:");
    contacts = await collection.find().toArray();
    console.log(contacts);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

main().catch(console.error);
