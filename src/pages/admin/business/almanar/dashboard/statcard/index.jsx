import { Button, Card, Col, Row } from 'antd';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon, color, link }) => {


  return (
    <Link to={link}>
      <Card
        hoverable
        className="mb-4"
        style={{ backgroundColor: color }}
      >
        <Row type="flex" align="middle" justify="start" gutter={16}>
          <Col>
            <Button
              shape="circle"
              size="small"
              type="primary"
              style={{ fontSize: '30px', backgroundColor: color, borderColor: color }}
              className='fill'
              //onClick={clickHandler}
            >
              {icon}
            </Button>

          </Col>
          <Col>
            <h5 className="mb-0 text-white">
              {value}
            </h5>
            <small className="text-white">
              {title}
            </small>
          </Col>
        </Row>
      </Card>
    </Link>
  );
};

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  icon: PropTypes.element,
  color: PropTypes.string
};

export default StatCard;