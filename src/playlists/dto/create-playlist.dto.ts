export class CreatePlaylistDto {
    PlaylistName: string;
    Owner: null;
    PlaylistCover: Buffer | null;
    Description: string | null;
    Private: boolean;
}
