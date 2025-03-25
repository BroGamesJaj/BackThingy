export class CreateFollowedDto {
    UserID: number;
    FollowedID: number;
    Type: "Playlist" | "Album" | "Artist";
}
