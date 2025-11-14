export interface ShareEntity {
    resourceId: string;
    resourceType: "FILE" | "FOLDER";
    users?: Array<{
        id: string;
        email: string;
        fullName: string;
    }>;
    teams?: Array<{
        id: string;
        name: string;
    }>;
    accessLevel: "VIEWER" | "EDITOR";
}
