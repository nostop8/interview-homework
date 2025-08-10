require("dotenv").config({ path: ".env.test" });
const { execSync } = require("child_process");
const fs = require("fs");

const schema = fs.readFileSync("./prisma/schema.prisma", "utf-8");
const modelNames = [...schema.matchAll(/^model (\w+) {/gm)].map(
  ([, name]) => name.charAt(0).toLowerCase() + name.slice(1)
);

let prisma;

beforeAll(async () => {
  execSync(`npx prisma db push --force-reset --schema=./prisma/schema.prisma`, {
    stdio: "inherit",
    env: process.env,
  });

  prisma = require("./prisma/client").prismaClient;
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await Promise.all(modelNames.map((name) => prisma[name].deleteMany()));
});
