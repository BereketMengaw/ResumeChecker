import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      // get user info
      const user = await currentUser();

      if (!user) throw new UploadThingError("Unauthorized");
      console.log("user", user);
      console.log(req);

      return { userId: user.id, "this is the user id ": user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("upload completed for user id", metadata.userId);
      console.log("file url", file.ufsUrl);

      return {     userId: metadata.userId,
        fileUrl: file.ufsUrl, // use the file URL instead of the entire file object
        fileName: file.name,};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
