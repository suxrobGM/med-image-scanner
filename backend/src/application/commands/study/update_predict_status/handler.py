import logging
from core import RequestHandler, Result, Mediator
from domain.entities import Series, Report, Finding
from domain.enums import PredictionStatus, MLModelType
from infrastructure import UnitOfWork
from .command import UpdatePredictionStatusCommand

@Mediator.register_handler(UpdatePredictionStatusCommand)
class UpdatePredictStatusHandler(RequestHandler[UpdatePredictionStatusCommand, Result]):
    def __init__(self, uow: UnitOfWork) -> None:
        self.uow = uow
        self.logger = logging.getLogger(__name__)

    def handle(self, req: UpdatePredictionStatusCommand) -> Result:
        series_repo = self.uow.get_repository(Series)
        series = series_repo.get_one(Series.id == req.series_id)

        if not series:
            return Result.fail(f"Series with ID '{req.series_id}' not found")
        
        if not PredictionStatus.has_value(req.status):
            return Result.fail("Invalid prediction status")
        
        if not MLModelType.has_value(req.model_type):
            return Result.fail("Invalid model type")
            
        series.prediction_model = req.model_type
        series.prediction_status = req.status
        series.prediction_result = req.result

        # Create a report if it doesn't exist
        if not series.report:
            self.create_report(series)

        series_repo.update(series)
        self.uow.commit()
        self.logger.info(f"Updated prediction status for series '{series.id}' to '{req.status}', model type '{req.model_type}', and result '{req.result}'")
        return Result.succeed()
    
    def create_report(self, series: Series) -> Report:
        report_repo = self.uow.get_repository(Report)
        new_report = Report(
            series_id=series.id,
            patient_id=series.study.patient_id,
        )

        if series.prediction_result and series.prediction_model == MLModelType.CHEST_XRAY_CLASSIFICATION:
            for k, v in series.prediction_result.items():
                if not isinstance(k, str) or not isinstance(v, float):
                    continue

                finding = Finding(
                    title=k.replace("_", " ").title(),
                    prediction_probability=v,
                    report_id=new_report.id
                )
                new_report.findings.append(finding)

        report_repo.add(new_report)
        self.logger.info(f"Created a new report for series '{series.id}'")
        return new_report
