import z from "zod";


export const CreateFolderSchema = z.object({
    name: z.string().nonempty('This field is required'),
    parentId: z.string().optional()
});


export type CreateFolderDTO = z.infer<typeof CreateFolderSchema>;
