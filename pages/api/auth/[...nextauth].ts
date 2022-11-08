import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { Roles } from "../../../src/shared/Roles";

const validUsers = [
  { id: "1", name: "Jane", roles: [Roles.admin] },
  { id: "2", name: "Steve", roles: [] },
];

const secret = process.env["NEXTAUTH_SECRET"] || "my secret";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Username",
      credentials: {
        name: {
          label: "",
          type: "text",
          placeholder: "Username, try Steve or Jane",
        },
      },
      authorize(credentials) {
        return (
          validUsers.find((user) => user.name === credentials?.name) || null
        );
      },
    }),
  ],
  secret: secret,
});

export async function getUserFromNextAuth(req: NextApiRequest) {
  const token = await getToken({ req, secret }); // import getToken from 'next-auth/jwt'
  return validUsers.find((u) => u.id === token?.sub);
}
