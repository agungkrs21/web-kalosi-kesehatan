export const sendNotif = async (title, body) => {
  try {
    const res = await fetch("https://api.onesignal.com/notifications?c=push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "key os_v2_app_jj4bm6jry5d2lejjwnux7cdryl677yllb2sehhvmxxdile2ymsop5xguzggs4qxlgmnob5frr4umwaajolo4miriis6iwc2aepvby5a",
      },
      body: JSON.stringify({
        app_id: "4a781679-31c7-47a5-9129-b3697f8871c2",
        target_channel: "push",
        included_segments: ["All"],
        headings: { en: title },
        contents: { en: body },
        url: "http://localhost:5173/", // opsional: ke mana diarahkan
      }),
    });
  } catch (error) {
    console.log("Gagal mengirm notif:", error);
  }
};

//os_v2_app_jj4bm6jry5d2lejjwnux7cdryl677yllb2sehhvmxxdile2ymsop5xguzggs4qxlgmnob5frr4umwaajolo4miriis6iwc2aepvby5a
