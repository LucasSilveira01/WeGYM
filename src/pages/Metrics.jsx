import Sidebar from '../components/Sidebar';
import Imc from '../components/Imc'
export default function Metrics() {
    return (
        <>
            <Sidebar />
            <div className="page">
                <Imc />
            </div>
        </>
    )
}
