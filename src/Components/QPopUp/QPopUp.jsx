import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import './QPopUp.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { userContextProvider } from '../../Contexts/UserContext';
import { loginDataContextProvider } from '../../Contexts/LoginDataContext';
import { pawnContextProvider } from '../../Contexts/PawnContext';
const QPopUp = (props) => {
    const { formData } = useContext(loginDataContextProvider);
    const { pawn } = useContext(pawnContextProvider);
    const regNo = formData.username;
    const { giveUp, from, difficulty, changePositionOnSuccess } = props;
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
            
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL+"/api/codes/run-code", {
                code: code,
                submissionId: submissionId,
                qId: question.qId,
                difficulty: difficulty
            });
            const data = response.data;
            if (data.status) {
                changePositionOnSuccess(from);
                toast.success(`${data.message}!`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            else {
                giveUp(from);
                toast.error("Code failed!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        catch (err) {
            console.log("Error");
        }
    }
    const fetchQuestion = async (difficulty) => {
        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL+"/api/details/getQuestion", { difficulty: difficulty, regNo: regNo });
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
    }, []);
    return (
        <div className='pop-up-block' id = {difficulty === 'hard' ? 'pop-up-block-hard' : 'undefined'}>
            <div className='pop-up-question-block' >
                <p>{questionHeading}</p>
                {difficulty === 'medium' ? (
                    <div><img id='question-image' src={`${process.env.REACT_APP_BACKEND_URL}/${question?.question}`} alt="" /></div>
                ) : (
                    <div className='question-block'><p>{question?.question}</p></div>
                )}
            </div>
            {(difficulty === 'hard') &&
                <div className='pop-up-compiler-block'>
                    <div data-pym-src="https://www.jdoodle.com/a/7fRG"></div>
                    <Helmet>
                        <script src="https://www.jdoodle.com/assets/jdoodle-pym.min.js" type="text/javascript" />
                    </Helmet>
                </div>
            }
            
            <div className='pop-up-code-block' id = {difficulty === 'medium' ? 'pop-up-code-block-img' : undefined} >
                <textarea onChange={changeCode} name="code" id="code" style={{ width: difficulty === 'medium' ? '18em' : (difficulty === "hard" ) ? '20em' : '40rem' }} 
                        rows={difficulty === 'medium' ? '15' : (difficulty === "hard") ? '15' : '15'} placeholder='Paste the code here to submit.'></textarea>
                <div className='pop-up-bottom-block'>
                    <button onClick={pushCode}>Submit</button>
                    <button onClick={() => {
                        giveUp(from);
                    }}>Give Up</button>
                </div>
            </div>
        </div>
    )
}

export default QPopUp;