import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/admin/*" element={<AdminRoutes />} />
				<Route path="/*" element={<PublicRoutes />} />
			</Routes>
		</Router>
	);
}

export default App;
