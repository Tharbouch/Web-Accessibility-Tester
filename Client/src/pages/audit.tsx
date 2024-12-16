import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { useQuery, useMutation } from '@tanstack/react-query';
import { connect, ConnectedProps } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import ResultsDetails from '../components/resultsDetails';
import ResultSummary from '../components/resultSummary';
import { FaFileDownload } from 'react-icons/fa';
import { selectAuthState } from '../redux/slices/authSlice';
import { selectReports, selectReport, setReports } from '../redux/slices/reportSlice';
import { stateType } from '../redux/store';

interface ReportType {
  violationsNumber: number;
  passedNumber: number;
  violations: {
    title: string;
    impact: string;
    disabilitiesAffected: string[];
    description: string;
    issues: {
      target: string;
      toBeFixed: {
        message: string;
        relatedNodes: {
          target: string;
        }[];
      }[];
    }[];
  }[];
  passed: any[];
  score: number;
  image: string;
}

const mapStateToProps = (state: stateType) => ({
  auth: selectAuthState(state),
  reports: selectReports(state),
});

const mapDispatch = {
  setReports,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

function Audit({ auth, reports, setReports }: PropsFromRedux) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state) {
    navigate('/');
    return null;
  }

  const { url, standard, reportID, report: initialReport } = location.state;

  const fetchReport = async (newTest: boolean): Promise<ReportType> => {
    if (!newTest && initialReport) {
      return {
        violationsNumber: initialReport.audit.failedSize,
        passedNumber: initialReport.audit.passedSize,
        violations: initialReport.audit.failed,
        passed: initialReport.audit.passed,
        score: initialReport.audit.score,
        image: initialReport.audit.image,
      };
    }

    const response = await axiosInstance({
      url: 'check-accessibility',
      method: 'POST',
      data: {
        url,
        standard,
        userID: auth.user?.userID || '',
        reportID: reportID || '',
      },
    });

    const newReport = {
      violationsNumber: response.data.failedSize,
      passedNumber: response.data.passedSize,
      violations: response.data.failed,
      passed: response.data.passed,
      score: response.data.score,
      image: response.data.image,
    };

    // Update Redux store with the fetched report
    setReports([...reports.allReports, newReport]);
    return newReport;
  };

  const { data: report, isLoading, error, refetch } = useQuery<ReportType, Error>(
    ['auditReport'],
    () => fetchReport(!initialReport),
    { retry: false }
  );

  const rescanMutation = useMutation(() => fetchReport(true), {
    onSuccess: () => {
      refetch();
    },
  });

  const total = report ? report.violationsNumber + report.passedNumber : 0;
  const violationsPercentage = total ? Math.round((report.violationsNumber / total) * 100) : 0;
  const passedPercentage = total ? Math.round((report.passedNumber / total) * 100) : 0;

  return (
    <section className="section-audit">
      {isLoading ? (
        <div className="loading-container">
          {error && (
            <>
              <h2>{error.message}</h2>
              <Link to="/">Go to Homepage</Link>
            </>
          )}
          <div className="image-wrapper">
            <img src="/images/testing.png" alt="loading illustration" />
          </div>
          <div className="description-wrapper">
            <h3>Scanning your page</h3>
            <SyncLoader color="#134e9d" />
          </div>
        </div>
      ) : (
        <>
          <div className="tools-container">
            <div className="tools-wrapper">
              <div className="download-btn-wrap">
                <button className="download-btn">
                  <FaFileDownload /> Download Report
                </button>
              </div>
              <div className="rescan-btn-wrap">
                <button className="rescan-btn" onClick={() => rescanMutation.mutate()}>
                  Rescan
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="left">
              <div className="title-wrapper">
                <h2>
                  Analyze result for: <br />
                  {url}
                </h2>
              </div>
              <div className="image-container">
                <img src={`data:image/png;base64,${report?.image}`} alt="website screenshot" />
              </div>
            </div>
            <div className="right">
              <ResultSummary
                report={report}
                violationsPercentage={violationsPercentage}
                passedPercentage={passedPercentage}
              />
              <ResultsDetails
                violationsReport={report?.violations || []}
                failedNumber={report?.violationsNumber || 0}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default connector(Audit);
