export const updateUser = async (payload) => {
  const API_ENDPOINT = "https://687bac3a0029d2106f44.fra.appwrite.run/";

  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("internal Error function update user:", error);
  }
};
