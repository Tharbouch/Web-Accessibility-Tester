import React from 'react';
import { FaLowVision, FaDeaf, FaBrain, FaHandPaper } from 'react-icons/fa';

type ArrayCheckComponentProps = {
    values: string[];
};

const ArrayCheckComponent: React.FC<ArrayCheckComponentProps> = ({ values }) => {
    const renderElements = (): React.ReactNode => {
        return values.map((value) => {
            let element: React.ReactNode;
            let text: string;

            switch (value) {
                case 'Visual':
                    element = <FaLowVision />;
                    text = 'Visual';
                    break;
                case 'Hearing':
                    element = <FaDeaf />;
                    text = 'Hearing';
                    break;
                case 'Cognitive':
                    element = <FaBrain />;
                    text = 'Cognitive';
                    break;
                case 'Motor':
                    element = <FaHandPaper />;
                    text = 'Motor';
                    break;
                default:
                    element = null;
                    text = '';
            }

            return (
                <>
                    <span>{element} {text}</span><br />

                </>
            );
        });
    };

    return <div className='disability-icons'>{renderElements()}</div>;
};

export default ArrayCheckComponent;
