import prisma from "@/lib/db";
import { Button } from "@base-ui/react";

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div>
      <Button>Button</Button>
      <h1 className="text-amber-50 text-extended bg-black">
        {JSON.stringify(users)}
      </h1>
    </div>
  );
}
