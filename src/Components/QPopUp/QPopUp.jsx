import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import './QPopUp.css';
import { toast } from 'react-toastify';
import { userContextProvider } from '../../Contexts/UserContext';
import { motion } from "framer-motion";
import { loginDataContextProvider } from '../../Contexts/LoginDataContext';
import { pawnContextProvider } from '../../Contexts/PawnContext';
import { socketContextProvider } from '../../Contexts/SocketContext';
import axios from 'axios';
const QPopUp = (props) => {
    const { formData } = useContext(loginDataContextProvider);
    const { pawn } = useContext(pawnContextProvider);
    const regNo = formData.username;
    const { giveUp, from, difficulty, changePositionOnSuccess, currPosition } = props;
    const [code, setCode] = useState(``);
    const { user } = useContext(userContextProvider);
    const [question, setQuestion] = useState();
    const [questionHeading, setQuestionHeading] = useState();
    const changeCode = (e) => {
        const { value } = e.target;
        setCode(value);
    }
    const pushCode = async (e) => {
        e.preventDefault();
        try {
            // replace hard values with qId and etc after frontend
            const submissionId = await user + new Date().getTime();
            const response = await axios.post('http://localhost:3001/api/codes/run-code', {
                code: code,
                submissionId: submissionId,
                qId: question.qId,
                difficulty: difficulty
            });
            const data = response.data;
            if (data.status) {
                changePositionOnSuccess(from);
            }
            else {
                giveUp(from);
            }
        }
        catch (err) {
            console.log("Error");
        }
    }
    const fetchQuestion = async (difficulty) => {
        try {
            const response = await axios.post('http://localhost:3001/api/details/getQuestion', { difficulty: difficulty, regNo: regNo });
            const data = response.data;
            if (data.status === true) {
                setQuestion(data.question);
            }
            else {
                console.log(data.message);
            }
        }
        catch (err) {
            console.log(err.message, 'Error Occured');
        }
    }
    const changeQuestionHeading = (difficulty) => {
        if (difficulty === 'easy') {
            setQuestionHeading("Correct the syntax and rewrite the code in the box below:");
        }
        else if (difficulty === 'medium') {
            setQuestionHeading("Fill the missing Code to get the desired output:");
        }
        else {
            setQuestionHeading('Solve the problem:');
        }
    }
    useState(() => {
        changeQuestionHeading(difficulty);
        fetchQuestion(difficulty);
        toast.info(`You are at position : ${currPosition} and there is a ${from} over here`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, }} // Initial state (invisible and slightly above)
            animate={{ opacity: 1, y: 0 }} // Animation state (visible and no movement)
            transition={{ delay: 1, duration: 0.5 }}
            className='pop-up-block'
        >
            <div className='pop-up-block-child'>
                <div className='pop-up-question-block' >
                    <p>{questionHeading}</p>
                    {difficulty !== 'medium' && <div className='question-block'><p>{question?.question}</p></div>}
                </div>
                <div className='pop-up-code-block' >
                    <div className='pop-up-code-dynamics'>
                        {(difficulty === 'medium') && <img className='medium-question-image' src={`http://localhost:3001/${question?.question}`} alt="" />}
                        {(difficulty === 'hard') &&
                            <div className='pop-up-compiler-block'>
                                <div data-pym-src="https://www.jdoodle.com/a/7fRG"></div>
                                <Helmet>
                                    <script src="https://www.jdoodle.com/assets/jdoodle-pym.min.js" type="text/javascript" />
                                </Helmet>
                            </div>
                        }
                        <textarea onChange={changeCode} name="code" id="code" placeholder='Paste the code here to submit.'></textarea>
                    </div>
                    <div className='pop-up-bottom-block'>
                        <button onClick={pushCode}>Submit</button>
                        <button onClick={() => {
                            giveUp(from);
                        }}>Give Up</button>
                    </div>
                </div>
            </div>
        </motion.div >
    )
}

export default QPopUp;