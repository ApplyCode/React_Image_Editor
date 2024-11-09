import axios from "axios";

async function uploadMediaImage(base64: string): Promise<string> {
  const baseURL = 'https://app.ecardwidget.com';
  const axiosAuthConfig = (window as any).ecwAxiosAuthConfig;

  let returnURL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  try {
    const res = await axios.post<{
      success: boolean;
      messages: string[];
      data: { image_url: string };
    }>(
      `${baseURL}/v2/api/ecard/upload-media-image`,
      {
        imageBase64: base64,
      },
      axiosAuthConfig
    );
    returnURL = res.data.data.image_url;
  } catch (_) {
    returnURL = base64;
  }

  return returnURL;
}

export {
  uploadMediaImage,
}
