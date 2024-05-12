"use client";

import { db, auth } from "@/config/firebase/config";
import { Button, DropdownTrigger, Input } from "@nextui-org/react";
import { Dropdown, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "@nextui-org/react";
import { update } from "firebase/database";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	deleteDoc,
	FieldValue,
	arrayRemove,
} from "firebase/firestore";

export default function Archive() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("Date");
	const [items, setItems] = useState([]);
	const [rawDocs, setRawDocs] = useState([]);
	const [dropdownEnabled, setDropdownEnables] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				getItems(user.uid);
			} else {
				router.replace(`/login`);
			}
		});
	}, []);

	const getItems = async (userID) => {
		try {
			const q = query(
				collection(db, "transcriptions"),
				where("userID", "==", userID)
			);
			const querySnapshot = await getDocs(q);
			setRawDocs(querySnapshot.docs);
			setItems(querySnapshot.docs);
		} catch (error) {
			console.error("Error: ", error);
			return null;
		}
	};

	const handleDeleteRow = async (id) => {
		try {
			const collectionRef = collection(db, "transcriptions");
			const q = query(
				collectionRef,
				where("userID", "==", auth.currentUser.uid),
			);

			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				console.log("Deleting: ", id);	
				const docRef = doc(db, "transcriptions", id);
				await deleteDoc(docRef);
				getItems(auth.currentUser.uid);
			}
		} catch (error) {
			console.error("Error: ", error);
			return null;
		}
	};

	const handleSwitchTerm = (e) => {
		setSortBy(e);

		if (e === "Date") {
			setItems(
				[...rawDocs].sort(
					(a, b) => new Date(b.data().time) - new Date(a.data().time)
				)
			);
		} else if (e === "Title") {
			setItems(
				[...rawDocs].sort((a, b) =>
					a.data().title.localeCompare(b.data().title)
				)
			);
		}
	};

	useEffect(() => {
		const filteredItems = rawDocs.filter((doc) =>
			doc.data().title.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setItems(filteredItems);
	}, [searchTerm, rawDocs]);

	return (
		<div className="flex w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
			<div className="container justify-center mx-auto py-8">
				<h1 className="text-4xl font-bold mb-6 text-center text-white">
					NoteKan Script Archive
				</h1>

				<div className="mb-8 flex justify-center space-x-4">
					<Input
						type="text"
						placeholder="Search..."
						className="rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text caret-blue-500 animate-blink-wide bg-white"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					<Dropdown isDisabled={!dropdownEnabled}>
						<DropdownTrigger>
							<Button className="rounded-md px-4 py-2 text-white bg-gray-800 hover:bg-gray-700">
								Sort By: {sortBy}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Sort Options"
							variant="flat"
							selectionMode="single"
							className="text-black bg-white shadow-lg rounded-md"
							onAction={(e) => handleSwitchTerm(e)}
						>
							<DropdownItem key="Date">Date</DropdownItem>
							<DropdownItem key="Title">Title</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full max-w-3xl border-collapse mx-auto bg-white rounded-lg shadow-lg">
						<thead>
							<tr className="bg-gray-200 text-center">
								<th
									className="py-2 px-4 text-black rounded-tl-lg"
									style={{ width: "70%" }}
								>
									Title
								</th>
								<th className="py-2 px-4 text-black" style={{ width: "20%" }}>
									Date
								</th>
								<th
									className="py-2 px-4 text-black rounded-tr-lg"
									style={{ width: "10%" }}
								></th>
							</tr>
						</thead>
						<tbody>
							{items.map((doc) => (
								<tr
									key={doc.id}
									className="border-b hover:bg-gray-100 transition-colors duration-300 relative group"
								>
									<td className="pb-2 pt-2 pr-4" style={{ width: "70%" }}>
										<Link
											href={
												"/dashboard/archivedTranscripts/transcriptcontent?id=" +
												doc.id
											}
											className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
										>
											{doc.data().title}
										</Link>
									</td>
									<td
										className="text-black pb-2 pt-2 pl-4 pr-4"
										style={{ width: "20%" }}
									>
										{new Date(doc.data().time).toLocaleString()}
									</td>
									<td
										className="pb-2 pt-2 pl-4 pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										style={{ width: "10%" }}
									>
										<button
											className="text-red-500 hover:text-red-700 transition-colors duration-300"
											onClick={() => handleDeleteRow(doc.id)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
