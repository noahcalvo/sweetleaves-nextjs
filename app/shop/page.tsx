import { getWPData } from '../../lib/wp';
import DutchieEmbed from './components/DutchieEmbed';

const PRODUCTS_QUERY = `
query Shop {
  pageBy(uri: "/shop") {
    headlessPageFields {
      header
      body1
    }
  }
}
`;

export default async function ShopPage() {
  let header = '';
  let body = '';
  try {
    const data = await getWPData(PRODUCTS_QUERY);
    const fields = data?.pageBy?.headlessPageFields;
    body = fields?.body1 ?? '';
    header = fields?.header ?? '';
  } catch (e) {
    console.error('Failed fetching products', e);
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold">{header}</h1>
      <div className="prose-lg mt-4">{body}</div>
      <div>
        <DutchieEmbed />
      </div>
    </main>
  );
}
