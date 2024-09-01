import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteSpotThunk, loadOneSpotThunk } from "../../store/spot";
import { useModal } from "../../context/Modal";
