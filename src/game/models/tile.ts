import { Coordinate } from "./coordinate";

export interface Tile {
    id: string;
    coordinate: Coordinate;
    value: number;
}