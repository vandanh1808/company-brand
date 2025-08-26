import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File, folder: string): Promise<string> {
	const fileName = `${folder}/${uuidv4()}-${file.name}`;
	const storageRef = ref(storage, fileName);

	const snapshot = await uploadBytes(storageRef, file);
	const downloadURL = await getDownloadURL(snapshot.ref);

	return downloadURL;
}

export function getImageUrl(path: string): string {
	return path;
}
