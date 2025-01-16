function NameSelector() {
    const [selectedNames, setSelectedNames] = React.useState([]);
    const [error, setError] = React.useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop().toLowerCase();
        if (fileExt !== 'csv' && fileExt !== 'tsv') {
            setError('Please upload a CSV or TSV file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const delimiter = fileExt === 'csv' ? ',' : '\t';
                const lines = text.split('\n');
                
                const names = lines
                    .slice(1)
                    .filter(line => line.trim())
                    .map(line => {
                        const [first, last] = line.split(delimiter);
                        return { first: first?.trim(), last: last?.trim() };
                    })
                    .filter(name => name.first && name.last);

                if (names.length < 10) {
                    setError('File must contain at least 10 names');
                    return;
                }

                const selected = [];
                const namesCopy = [...names];
                for (let i = 0; i < 10; i++) {
                    const randomIndex = Math.floor(Math.random() * namesCopy.length);
                    selected.push(namesCopy.splice(randomIndex, 1)[0]);
                }

                setSelectedNames(selected);
                setError('');
            } catch (err) {
                setError('Error processing file. Please check the format.');
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
        };

        reader.readAsText(file);
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Random Name Selector</h1>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <label className="cursor-pointer">
                    <span className="block text-sm font-medium text-gray-600">
                        Upload CSV or TSV file
                    </span>
                    <input
                        type="file"
                        accept=".csv,.tsv"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            {selectedNames.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Selected Names:</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        {selectedNames.map((name, index) => (
                            <div key={index} className="py-1">
                                {index + 1}. {name.first} {name.last}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => {
                            setSelectedNames([]);
                            setError('');
                        }}
                        className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Clear Results
                    </button>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <NameSelector />
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
