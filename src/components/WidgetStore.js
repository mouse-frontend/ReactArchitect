import React from 'react';

import * as FontAwesome from 'react-icons/lib/fa';

export default class WidgetComponents extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="widget">
					<div className="widget-header">
						<div className="widget-title">Reducers</div>
					</div>
					<div className="widget-body">
						reducers
					</div>
					<div className="widget-footer">
						<button
							className="btn-add"
						>
							<FontAwesome.FaPlus />
						</button>
					</div>
				</div>
				<div className="widget">
					<div className="widget-header">
						<div className="widget-title">Actions</div>
					</div>
					<div className="widget-body">
						actions
					</div>
					<div className="widget-footer">
						<button
							className="btn-add"
						>
							<FontAwesome.FaPlus />
						</button>
					</div>
				</div>
				<div className="widget">
					<div className="widget-header">
						<div className="widget-title">Router</div>
					</div>
					<div className="widget-body">
						routes
					</div>
					<div className="widget-footer">
						<button
							className="btn-add"
						>
							<FontAwesome.FaPlus />
						</button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
