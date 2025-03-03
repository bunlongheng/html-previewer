import type { NextPage } from 'next';
import HtmlPreviewer from '../components/HtmlPreviewer';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HTML Previewer</h1>
      <HtmlPreviewer />
    </div>
  );
};

export default Home;