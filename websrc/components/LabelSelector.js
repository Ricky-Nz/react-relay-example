import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

class LabelSelector extends React.Component {
	render() {
		const { title, showAllLabel, allLabels, selectLabels } = this.props;
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			padding: '10px 0px'
		};
		const itemStyle = {
			margin: '2px 4px'
		};
		const itemViews = allLabels&&allLabels.map((label, index) =>(
			<Button key={index} style={itemStyle} bsSize='xsmall'
				bsStyle={selectLabels&&selectLabels.indexOf(label)>=0?'info':'default'}
				onClick={this.onItemClick.bind(this, label)}>{label}</Button>
		));

		return (
			<div>
				<b>{title}</b>
				<div style={contentStyle}>
					{showAllLabel&&<Button style={itemStyle} bsSize='xsmall' bsStyle={selectLabels&&selectLabels.length?'info':'default'}
						onClick={this.onItemClick.bind(this, null)}>All</Button>}
					{itemViews}
				</div>
			</div>
		);
	}
	onItemClick(label) {
		if (!label) {
			return [];
		} else {
			const currentSelects = this.props.selectLabels;
			const selectIndex = currentSelects&&currentSelects.indexOf(label);
			if (selectIndex >= 0) {
				this.props.onSelectChange(
					[...currentSelects.slice(0, selectIndex), ...currentSelects.slice(selectIndex+1)]);
			} else if (currentSelects) {
				this.props.onSelectChange([...currentSelects, label]);
			} else {
				this.props.onSelectChange([label]);
			}
		}
	}
}

LabelSelector.propTypes = {
	title: PropTypes.string,
	showAllLabel: PropTypes.bool,
	allLabels: PropTypes.arrayOf(PropTypes.string),
	selectLabels: PropTypes.arrayOf(PropTypes.string),
	onSelectChange: PropTypes.func.isRequired
};

LabelSelector.defaultProps = {
	showAllLabel: false
};

export default LabelSelector;

