import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Container, Spinner, Alert, ListGroup, ListGroupItem } from 'reactstrap'
import { fetchTransactionsHistory } from '../../../rtk/slices/transactionsListSlice/transactionsListSlice';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

const Index = () => {

    const dispatch = useDispatch();
    const { transactionsList, loading, error } = useSelector((state) => state.transactionsHistory);
    const { t } = useTranslation()

    useEffect(() => {
        const token = localStorage.getItem("token"); // Get token from storage

        if (token) {
            dispatch(fetchTransactionsHistory({ token }));
        }
    }, [dispatch]);

    useEffect(() => {
        let topbar = document.getElementById('page-topbar')
        topbar.style.marginTop = "0px"
    }, [])

    return (
        <>
        <div
  className="page-content"
  style={{
    backgroundImage: `url(${trading})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "24px 0",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    height: "89vh",
    backdropFilter: "blur(6px)",
  }}
>
  <BackButton />
  <Container fluid>
    <h3
      className="mb-0"
      style={{
        color: "#fff",
        fontWeight: "600",
        letterSpacing: "0.5px",
      }}
    >
      {t("Transactions")}
    </h3>

    {loading && (
      <div className="text-center mt-5">
        <Spinner color="light" size="lg" />
        <p className="mt-3 text-light fw-semibold">
          {t("Loading transactions...")}
        </p>
      </div>
    )}

    {error && (
      <Alert
        color="danger"
        className="mt-3 rounded-3 shadow-sm fw-semibold"
      >
        {error}
      </Alert>
    )}

    {!loading && transactionsList.length === 0 && (
      <Alert
        color="secondary"
        className="mt-3 text-center rounded-3 bg-opacity-25 text-light fw-semibold"
      >
        {t("No transactions found.")}
      </Alert>
    )}

    {!loading && transactionsList.length > 0 && (
      <ListGroup className="mt-4">
        {transactionsList.map((transaction) => (
          <ListGroupItem
            key={transaction.id}
            className="mb-3 d-flex justify-content-between align-items-center border-0 text-light"
            style={{
              borderRadius: "12px",
              background:
                "linear-gradient(145deg, #1e0f29, #2b1836)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              padding: "16px 20px",
            }}
          >
            <div>
              <h6
                className="mb-1"
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#fff",
                }}
              >
                {transaction.details}
              </h6>
              <small
                style={{
                  color: "#aaa",
                  fontSize: "13px",
                }}
              >
                {new Date(transaction.created_at).toLocaleString()}
              </small>
            </div>
            <div className="text-end">
              <p className="mb-1">
                <span
                  className={`badge ${
                    transaction.trx_type === "+"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                  style={{
                    padding: "6px 10px",
                    fontSize: "13px",
                    borderRadius: "8px",
                  }}
                >
                  {transaction.trx_type === "+" ? "+" : "-"}
                </span>
                <strong
                  className="ms-3"
                  style={{ fontSize: "16px", color: "#fff" }}
                >
                  ${Number(transaction.amount).toFixed(2)}
                </strong>
              </p>
              <strong
                style={{
                  fontSize: "13px",
                  color: "#bbb",
                  letterSpacing: "0.3px",
                }}
              >
                #{transaction.trx}
              </strong>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    )}
  </Container>
</div>


        </>
    )
}

export default Index
