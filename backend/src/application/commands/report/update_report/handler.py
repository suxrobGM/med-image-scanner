from core import RequestHandler, Result, Mediator
from domain.entities import Report, User, Finding
from infrastructure import UnitOfWork
from .command import UpdateFindingPayload, UpdateReportCommand

@Mediator.register_handler(UpdateReportCommand)
class UpdateReportHandler(RequestHandler[UpdateReportCommand, Result]):
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def handle(self, req: UpdateReportCommand) -> Result:
        report_repo = self.uow.get_repository(Report)
        report = report_repo.get_one(Report.id == req.id)

        if not report:
            return Result.fail(f"Report with ID {req.id} not found")
        
        if req.clinincal_info != report.clinincal_info:
            report.clinincal_info = req.clinincal_info

        if req.indication != report.indication:
            report.indication = req.indication

        if req.technique != report.technique:
            report.technique = req.technique

        if req.impression != report.impression:
            report.impression = req.impression

        if req.recommendation != report.recommendation:
            report.recommendation = req.recommendation

        if req.signed_at != report.signed_at:
            report.signed_at = req.signed_at

        if req.referring_physician_id:
            update_physician_result = self.update_referring_physician(report, req.referring_physician_id)
            if not update_physician_result.success:
                return Result.fail(update_physician_result.error)
        
        if len(req.findings) > 0:
            update_findings_result = self.update_findings(report, req.findings)
            if not update_findings_result.success:
                return Result.fail(update_findings_result.error)
        
        report_repo.update(report)
        self.uow.commit()  
        return Result.succeed()
    
    def update_referring_physician(self, report: Report, referring_physician_id: str) -> Result:
        user_repo = self.uow.get_repository(User)
        user = user_repo.get_one(User.id == referring_physician_id)

        if not user:
            return Result.fail(f"User with ID {referring_physician_id} not found")

        report.referring_physician = user
        return Result.succeed()
    
    def update_findings(self, report: Report, findings: list[UpdateFindingPayload]) -> Result:
        for finding in findings:
            if not finding.id:
                add_finding_result = self.add_finding(report, finding)
                if not add_finding_result.success:
                    return Result.fail(add_finding_result.error)

            for existing_finding in report.findings:
                if existing_finding.id == finding.id:
                    self.update_finding_details(existing_finding, finding)
                    break
        return Result.succeed()
    
    def update_finding_details(self, existing_finding: Finding, updated_finding: UpdateFindingPayload) -> None:
        if updated_finding.title and existing_finding.title != updated_finding.title:
            existing_finding.title = updated_finding.title

        if existing_finding.description != updated_finding.description:
            existing_finding.description = updated_finding.description

        if existing_finding.approved != updated_finding.approved:
            existing_finding.approved = updated_finding.approved

    def add_finding(self, report: Report, finding: UpdateFindingPayload) -> Result:
        if not finding.title:
            return Result.fail("Finding title is required")

        new_finding = Finding(
            title=finding.title,
            description=finding.description,
            approved=finding.approved,
            report_id=report.id
        )
        report.findings.append(new_finding)
        return Result.succeed()
