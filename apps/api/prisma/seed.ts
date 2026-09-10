import { ListingStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cities = [
  { id: "amd", name: "Ahmedabad" },
  { id: "del", name: "Delhi" },
  { id: "mum", name: "Mumbai" },
  { id: "jai", name: "Jaipur" },
  { id: "blr", name: "Bangalore" },
  { id: "hyd", name: "Hyderabad" },
  { id: "pun", name: "Pune" },
  { id: "chn", name: "Chennai" },
];

const natures = [
  { id: "mfr", name: "Manufacture" },
  { id: "spd", name: "Supplier / Dealer" },
  { id: "fctr", name: "Fire Contractor" },
  { id: "fcns", name: "Fire Consultant / Auditor" },
  { id: "fsft", name: "Fire Safety Professionals" },
  { id: "fwld", name: "Fire welders/ Fabricators" },
];

const categories = [
  { id: "ext", name: "Fire Extinguisher" },
  { id: "alm", name: "Fire Alarm" },
  { id: "hyd", name: "Hydrant System" },
  { id: "spr", name: "Sprinkler" },
  { id: "amc", name: "AMC" },
  { id: "aud", name: "Fire Audit" },
  { id: "sft", name: "Safety Equipment" },
];

const baseListings = [
  {
    name: "Rajesh Patel",
    company: "SafeGuard Fire Systems",
    phone: "9876543210",
    email: "rajesh@safeguard.in",
    photo: "/avatars/user-1.jpg",
    cityId: "amd",
    natureId: "mfr",
    categoryId: "ext",
    service: "ABC & CO2 extinguisher manufacturing",
    status: ListingStatus.APPROVED,
    important: true,
  },
  {
    name: "Amit Sharma",
    company: "Delhi Fire Alarms Pvt Ltd",
    phone: "9123456780",
    email: "amit@dfa.in",
    photo: "/avatars/user-2.jpg",
    cityId: "del",
    natureId: "fctr",
    categoryId: "alm",
    service: "Addressable fire alarm installation",
    status: ListingStatus.APPROVED,
    important: true,
  },
  {
    name: "Suresh Mehta",
    company: "HydroSafe Engineers",
    phone: "9988776655",
    photo: "/avatars/user-3.jpg",
    cityId: "mum",
    natureId: "fctr",
    categoryId: "hyd",
    service: "Wet riser & hydrant system contracting",
    status: ListingStatus.APPROVED,
    important: true,
  },
  {
    name: "Priya Nair",
    company: "SprinkleTech Solutions",
    phone: "9090901234",
    photo: "/avatars/user-4.jpg",
    cityId: "blr",
    natureId: "fsft",
    categoryId: "spr",
    service: "Sprinkler system AMC & retrofit",
    status: ListingStatus.APPROVED,
    important: false,
  },
  {
    name: "Vikram Singh",
    company: "Jaipur Safety Consultants",
    phone: "9811122233",
    cityId: "jai",
    natureId: "fcns",
    categoryId: "aud",
    service: "Fire audit & NOC consulting",
    status: ListingStatus.APPROVED,
    important: false,
  },
  {
    name: "Farhan Khan",
    company: "Mumbai Safety Gear",
    phone: "9765432109",
    cityId: "mum",
    natureId: "spd",
    categoryId: "sft",
    service: "PPE, helmets & safety equipment trading",
    status: ListingStatus.APPROVED,
    important: false,
  },
  {
    name: "Ananya Reddy",
    company: "Hyderabad AMC Care",
    phone: "9000011122",
    cityId: "hyd",
    natureId: "fsft",
    categoryId: "amc",
    service: "Annual maintenance for fire systems",
    status: ListingStatus.APPROVED,
    important: true,
  },
  {
    name: "Karan Joshi",
    company: "Pune Extinguishers Supply",
    phone: "9887766554",
    cityId: "pun",
    natureId: "spd",
    categoryId: "ext",
    service: "Bulk extinguisher supply & refill",
    status: ListingStatus.APPROVED,
    important: false,
  },
  {
    name: "Meera Iyer",
    company: "Chennai Fire Consultants",
    phone: "9776655443",
    cityId: "chn",
    natureId: "fcns",
    categoryId: "aud",
    service: "Industrial fire risk assessment",
    status: ListingStatus.PENDING,
    important: false,
  },
  {
    name: "Rohit Agarwal",
    company: "Ahmedabad Hydrant Works",
    phone: "9665544332",
    cityId: "amd",
    natureId: "fwld",
    categoryId: "hyd",
    service: "Underground hydrant pipeline works",
    status: ListingStatus.PENDING,
    important: false,
  },
];

const extraNames = [
  ["Neha Kapoor", "FlameGuard India"],
  ["Arjun Desai", "SecureFire Solutions"],
  ["Sneha Pillai", "Alert Systems Co"],
  ["Imran Qureshi", "RiserTech Contractors"],
  ["Kavita Menon", "SafetyFirst Audits"],
  ["Dev Patel", "Extinguish Pro"],
  ["Nisha Verma", "AlarmLink Services"],
  ["Rahul Bose", "Sprinkler Hub"],
  ["Pooja Shah", "FireCare AMC"],
  ["Mohit Jain", "HydroLine Engineers"],
  ["Aisha Khan", "ProtectGear Traders"],
  ["Sanjay Rao", "Nova Fire Systems"],
  ["Divya Krishnan", "SparkSafe Consultants"],
  ["Harsh Malhotra", "Prime Hydrant Co"],
  ["Lakshmi Iyer", "Urban Fire Audit"],
];

async function main() {
  await prisma.bannerCategory.deleteMany();
  await prisma.bannerCity.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.nature.deleteMany();
  await prisma.city.deleteMany();
  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash("phonebook@123", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@phonebook.com",
      passwordHash,
    },
  });

  for (const city of cities) {
    await prisma.city.create({ data: city });
  }
  for (const nature of natures) {
    await prisma.nature.create({ data: nature });
  }
  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  const cityIds = cities.map((c) => c.id);
  const natureIds = natures.map((n) => n.id);
  const categoryIds = categories.map((c) => c.id);

  for (const listing of baseListings) {
    await prisma.listing.create({ data: listing });
  }

  for (let index = 0; index < extraNames.length; index += 1) {
    const [name, company] = extraNames[index]!;
    await prisma.listing.create({
      data: {
        name,
        company,
        phone: `98${String(10000000 + index).slice(0, 8)}`,
        cityId: cityIds[index % cityIds.length]!,
        natureId: natureIds[index % natureIds.length]!,
        categoryId: categoryIds[index % categoryIds.length]!,
        service: `${company} fire safety services`,
        status: index % 4 === 0 ? ListingStatus.PENDING : ListingStatus.APPROVED,
        important: index % 5 === 0,
        photo: index < 4 ? `/avatars/user-${(index % 4) + 1}.jpg` : null,
      },
    });
  }

  await prisma.banner.create({
    data: {
      imageUrl: "/uploads/banners/seed-default.svg",
    },
  });

  await prisma.banner.create({
    data: {
      imageUrl: "/uploads/banners/seed-ext.svg",
      categories: { create: [{ categoryId: "ext" }] },
    },
  });

  await prisma.banner.create({
    data: {
      imageUrl: "/uploads/banners/seed-amd.svg",
      cities: { create: [{ cityId: "amd" }] },
    },
  });

  await prisma.banner.create({
    data: {
      imageUrl: "/uploads/banners/seed-alm-del.svg",
      categories: { create: [{ categoryId: "alm" }] },
      cities: { create: [{ cityId: "del" }] },
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
