

export interface SharePayload {
    fileId?: string;
    folderId?: string;
    emails?: string[];
    teamIds?: string[];
    access: "VIEW" | "EDIT";
    note?: string;
}
