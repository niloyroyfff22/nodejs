import Loading from '../components/Loading';
import { useState } from 'preact/hooks';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };
    return (<>
      
        <div>
            <h1>Home Page</h1>

          <button onClick={simulateLoad}>Show Loading</button>
      <Loading visible={loading} text="Loading your data..." />
        </div>
    </>
    );
}