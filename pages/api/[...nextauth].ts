import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const validUsers = [
  { id: "1", name: "Jane", roles: ["admin"] },
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
