export class Playlist {
    PlaylistID: number;
    OwnerID: number;
    PlaylistName: string;
    Description: string | null;
    PlaylistCover: Buffer | null;
    Private: boolean;
    Tracks: {
        PlaylistID: number;
        TrackID: number;
        SongID: number;
    }[];
}
