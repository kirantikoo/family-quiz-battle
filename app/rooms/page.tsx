"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import AvatarImage from "@/components/AvatarImage";
import BottomNav from "@/components/BottomNav";
import { getPlayerData } from "@/lib/storage";
import { getResolvedAvatar } from "@/lib/avatar";
import { getDisplayName } from "@/lib/getDisplayName";
import { supabase } from "@/lib/supabase/client";

type RoomPlayer = {
  id: string;
  name: string;
  avatar: string;
};

type Room = {
  code: string;
  host: RoomPlayer;
  players: RoomPlayer[];
  createdAt: string;
};

const ROOMS_KEY = "family_quiz_rooms";

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function getRooms(): Room[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(ROOMS_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved).map(migrateRoom);
  } catch {
    return [];
  }
}

function saveRooms(rooms: Room[]) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const roomsTimer = window.setTimeout(() => {
      setRooms(getRooms());
    }, 0);

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    return () => {
      window.clearTimeout(roomsTimer);
    };
  }, []);

  function currentRoomPlayer(): RoomPlayer {
    const player = getPlayerData();
    const name = getDisplayName(user, player);

    return {
      id: user?.id ?? name,
      name,
      avatar: getResolvedAvatar(player, user),
    };
  }

  function createRoom() {
    const roomPlayer = currentRoomPlayer();
    const code = generateRoomCode();

    const newRoom: Room = {
      code,
      host: roomPlayer,
      players: [roomPlayer],
      createdAt: new Date().toLocaleString(),
    };

    const updatedRooms = [newRoom, ...rooms];

    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  }

  function joinRoom(code: string) {
    const player = currentRoomPlayer();
    const targetCode = code.trim().toUpperCase();

    if (!targetCode) return;

    const updatedRooms = rooms.map((room) => {
      if (room.code !== targetCode) return room;

      if (room.players.some((roomPlayer) => roomPlayer.id === player.id)) {
        return room;
      }

      return {
        ...room,
        players: [...room.players, player],
      };
    });

    const roomExists = rooms.some((room) => room.code === targetCode);

    if (!roomExists) {
      alert("Room not found");
      return;
    }

    setRooms(updatedRooms);
    saveRooms(updatedRooms);
    setJoinCode("");
  }

  function deleteRoom(code: string) {
    const updatedRooms = rooms.filter((room) => room.code !== code);
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Back home" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black shadow-lg backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            ←
          </Link>

          <h1 className="text-lg font-black sm:text-xl">Live Rooms</h1>

          <button
            type="button"
            onClick={createRoom}
            className="rounded-2xl bg-white px-3 py-3 text-sm font-black text-purple-700 shadow-lg transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:px-5 sm:text-base"
          >
            + Create
          </button>
        </div>

        <div className="mt-6 rounded-[30px] bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-5 shadow-2xl sm:mt-8 sm:rounded-[36px] sm:p-8">
          <p className="text-sm font-black uppercase tracking-widest text-white/80">
            Family Battle Room
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Create or Join a Room</h2>

          <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
            Share your room code with family and start a quiz battle together.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter room code"
              className="min-h-14 flex-1 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 font-bold text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-cyan-300"
            />

            <button
              type="button"
              onClick={() => joinRoom(joinCode)}
              className="min-h-14 rounded-2xl bg-white px-6 py-4 font-black text-purple-700 shadow-lg transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Join Room
            </button>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between sm:mt-8">
          <h2 className="text-xl font-black sm:text-2xl">Available Rooms</h2>
          <p className="text-white/60">{rooms.length} rooms</p>
        </div>

        <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.code}
                className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Room Code</p>
                    <h3 className="text-2xl font-black sm:text-3xl">{room.code}</h3>
                  </div>

                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black">
                    LOCAL
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-white/60">Players</p>

                  <div className="mt-3 flex -space-x-2">
                    {room.players.map((player, index) => (
                      <div
                        key={`${player.id}-${index}`}
                        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#312E81] bg-white text-2xl"
                        title={player.name}
                      >
                        <AvatarImage
                          src={player.avatar}
                          alt={player.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-white/60">
                    {room.players.length}/8 players
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => joinRoom(room.code)}
                    className="min-h-12 rounded-2xl bg-purple-600 py-3 font-black transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    Join
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteRoom(room.code)}
                    className="min-h-12 rounded-2xl bg-red-500/80 py-3 font-black transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[30px] border border-white/10 bg-white/10 p-6 text-center text-white/70 shadow-2xl backdrop-blur-xl md:col-span-2 xl:col-span-3">
              No rooms yet. Create your first family room.
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

function migrateRoom(value: unknown): Room {
  const room = value as Partial<Room> & {
    host?: string | RoomPlayer;
    players?: Array<string | RoomPlayer>;
  };
  const players = Array.isArray(room.players) ? room.players.map(migrateRoomPlayer) : [];
  const host =
    typeof room.host === "object" && room.host
      ? migrateRoomPlayer(room.host)
      : players[0] ?? migrateRoomPlayer(room.host ?? "Guest");

  return {
    code: typeof room.code === "string" ? room.code : generateRoomCode(),
    host,
    players: players.length > 0 ? players : [host],
    createdAt:
      typeof room.createdAt === "string"
        ? room.createdAt
        : new Date().toLocaleString(),
  };
}

function migrateRoomPlayer(value: string | RoomPlayer | undefined): RoomPlayer {
  if (typeof value === "object" && value) {
    return {
      id: value.id || value.name || "Guest",
      name: value.name || "Guest",
      avatar: value.avatar || "/icon-avatar.png",
    };
  }

  return {
    id: value || "Guest",
    name: value || "Guest",
    avatar: "/icon-avatar.png",
  };
}
