import Loading from '../components/Loading';
import { useState } from 'preact/hooks';
import { useAlert } from "../hooks/useAlert";
export default function Home() {
  const [loading, setLoading] = useState(false);
const { show, AlertComponent } = useAlert();
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
        
        <button onClick={() => show("Login successful", "Success")}>
        Show Alert
      </button>
    </>
    );
}