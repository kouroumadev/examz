<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ExamCategoryTypeController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\InstituteAdminController;
use App\Http\Controllers\InstituteController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OperatorTeamController;
use App\Http\Controllers\PracticeController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentPageController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserController;
<<<<<<< HEAD
use App\Http\Controllers\ExamInstructionController;
use App\Http\Controllers\ExamConfigurationController;
=======
use App\Http\Controllers\VerificationController;
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// NO AUTH Routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgot']);
    Route::post('reset-password', [AuthController::class, 'reset']);
    Route::get('social/{provider}', [SocialiteController::class, 'redirectToProvider']);
    Route::get('social/{provider}/callback', [SocialiteController::class, 'handleProviderCallback']);
    Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
});
Route::get('exam-category', [ExamCategoryTypeController::class, 'allCategory']);
Route::get('exam-type', [ExamCategoryTypeController::class, 'allType']);
<<<<<<< HEAD
Route::get('instruction', [ExamInstructionController::class, 'allInstruction']);
Route::get('exam-configuration', [ExamConfigurationController::class, 'allConfig']);
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

Route::group(['prefix' => 'landing'], function () {
    Route::get('news', [LandingController::class, 'news']);
    Route::get('news/{news:slug}', [LandingController::class, 'showNews']);

    Route::get('exams-live', [LandingController::class, 'liveExams']);
    Route::get('exams-category/{id}', [LandingController::class, 'categoryExams']);
    Route::get('exams-upcoming', [LandingController::class, 'upcomingExams']);
    Route::get('exams-previous', [LandingController::class, 'previousExams']);
    Route::get('exams-previous/{exam:slug}', [LandingController::class, 'showPreviousExams']);

    Route::get('quizzes-live', [LandingController::class, 'liveQuizzes']);
});

Route::get('check-token', [HomeController::class, 'checkExpiredToken']);


// All routes below these are authenticated
Route::group(['middleware' => ['api', 'email.verify']], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('profile', [AuthController::class, 'profile']);
    });

    Route::put('update-profile', [UserController::class, 'updateProfile']);
    Route::put('update-password', [UserController::class, 'updatePassword']);

    Route::group(['middleware' => ['role:SA|IA|OT|STF']], function () {
        Route::get('branch', [BranchController::class, 'index']);
        Route::get('branch/all', [BranchController::class, 'all']);
        Route::get('branch/{id}', [BranchController::class, 'show']);

        Route::get('batch/all', [BatchController::class, 'all']);
        Route::get('topic/all', [TopicController::class, 'all']);

        Route::post('image-upload', [ImageController::class, 'store']);
<<<<<<< HEAD
=======
        Route::post('image-upload-link', [ImageController::class, 'imageUploadLink']);
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

        Route::get('exam', [ExamController::class, 'index']);
        Route::get('exam/{id}', [ExamController::class, 'show']);
        Route::get('exam-section/{id}', [ExamController::class, 'showSection']);
        Route::get('exam-question/{questionId}', [ExamController::class, 'showQuestion']);
        Route::get('exam-section-question/{id}', [ExamController::class, 'showSectionQuestion']);
<<<<<<< HEAD
        Route::get('exam-section-details/{id}', [ExamController::class, 'showSectionDetails']);
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
        Route::post('exam', [ExamController::class, 'store']);
        Route::post('exam-question', [ExamController::class, 'storeQuestion']);
        Route::put('exam/{id}', [ExamController::class, 'update']);
        Route::put('exam-question/{questionId}', [ExamController::class, 'updateQuestion']);
        Route::put('exam/{id}/publish', [ExamController::class, 'publish']);
        Route::put('exam/{id}/unpublish', [ExamController::class, 'unpublish']);
        Route::delete('exam/{id}', [ExamController::class, 'destroy']);
        Route::delete('exam-question/{questionId}', [ExamController::class, 'destroyQuestion']);

        Route::get('practice', [PracticeController::class, 'index']);
        Route::get('practice/{id}', [PracticeController::class, 'show']);
        Route::get('practice-section/{id}', [PracticeController::class, 'showSection']);
        Route::get('practice-question/{questionId}', [PracticeController::class, 'showQuestion']);
        Route::get('practice-section-question/{id}', [PracticeController::class, 'showSectionQuestion']);
        Route::post('practice', [PracticeController::class, 'store']);
        Route::post('practice-question', [PracticeController::class, 'storeQuestion']);
        Route::put('practice/{id}', [PracticeController::class, 'update']);
        Route::put('practice-question/{questionId}', [PracticeController::class, 'updateQuestion']);
        Route::put('practice/{id}/publish', [PracticeController::class, 'publish']);
        Route::put('practice/{id}/unpublish', [PracticeController::class, 'unpublish']);
        Route::delete('practice/{id}', [PracticeController::class, 'destroy']);
        Route::delete('practice-question/{questionId}', [PracticeController::class, 'destroyQuestion']);

        Route::get('quiz', [QuizController::class, 'index']);
        Route::get('quiz/{id}', [QuizController::class, 'show']);
        Route::get('quiz-question/{id}', [QuizController::class, 'showQuestion']);
        Route::post('quiz', [QuizController::class, 'store']);
        Route::put('quiz/{id}', [QuizController::class, 'update']);
        Route::put('quiz/{id}/publish', [QuizController::class, 'publish']);
        Route::put('quiz/{id}/unpublish', [QuizController::class, 'unpublish']);
        Route::delete('quiz/{id}', [QuizController::class, 'destroy']);
    });

    Route::group(['middleware' => ['role:SA']], function () {
        Route::get('institute/admin', [InstituteAdminController::class, 'index']);
        Route::get('institute/admin/{id}', [InstituteAdminController::class, 'show']);
        Route::post('institute/admin', [InstituteAdminController::class, 'store']);
        Route::put('institute/admin/{id}', [InstituteAdminController::class, 'update']);
        Route::delete('institute/admin/{id}', [InstituteAdminController::class, 'destroy']);

        Route::get('operator', [OperatorTeamController::class, 'index']);
        Route::get('operator/{id}', [OperatorTeamController::class, 'show']);
        Route::post('operator', [OperatorTeamController::class, 'store']);
        Route::put('operator/{id}', [OperatorTeamController::class, 'update']);
        Route::delete('operator/{id}', [OperatorTeamController::class, 'destroy']);

        Route::get('institute', [InstituteController::class, 'index']);
        Route::get('institute/all', [InstituteController::class, 'all']);
        Route::get('institute/{id}', [InstituteController::class, 'show']);
        Route::post('institute', [InstituteController::class, 'store']);
        Route::put('institute/{id}', [InstituteController::class, 'update']);
        Route::delete('institute/{id}', [InstituteController::class, 'destroy']);

        Route::get('news', [NewsController::class, 'index']);
        Route::get('news/{id}', [NewsController::class, 'show']);
        Route::post('news', [NewsController::class, 'store']);
        Route::put('news/{id}', [NewsController::class, 'update']);
        Route::put('news/{id}/status', [NewsController::class, 'updateStatus']);
        Route::delete('news/{id}', [NewsController::class, 'destroy']);

        Route::get('topic', [TopicController::class, 'index']);
        Route::get('topic/{id}', [TopicController::class, 'show']);
        Route::post('topic', [TopicController::class, 'store']);
        Route::put('topic/{id}', [TopicController::class, 'update']);
        Route::delete('topic/{id}', [TopicController::class, 'destroy']);

        Route::put('branch/{id}/status', [BranchController::class, 'updateStatus']);
    });

    Route::group(['middleware' => ['role:SA|OT']], function () {
        Route::get('home/institutes', [HomeController::class, 'listInstitute']);
        Route::get('home/total-institute-student', [HomeController::class, 'totalInstituteAndStudent']);
    });

    Route::group(['middleware' => ['role:IA|STF']], function () {
        Route::post('branch', [BranchController::class, 'store']);
        Route::put('branch/{id}', [BranchController::class, 'update']);
        Route::delete('branch/{id}', [BranchController::class, 'destroy']);

        Route::get('batch', [BatchController::class, 'index']);
        Route::get('batch/{id}', [BatchController::class, 'show']);
        Route::post('batch', [BatchController::class, 'store']);
        Route::put('batch/{id}', [BatchController::class, 'update']);
        Route::delete('batch/{id}', [BatchController::class, 'destroy']);

        Route::put('student/{enrollmentId}/status', [StudentController::class, 'updateStatus']);
        Route::get('student', [StudentController::class, 'index']);
        Route::get('student/{id}', [StudentController::class, 'show']);
        Route::get('student/{id}/graph', [StudentController::class, 'graphPerformance']);
        Route::post('student', [StudentController::class, 'store']);
        Route::put('student/{id}', [StudentController::class, 'update']);
        Route::delete('student/{id}', [StudentController::class, 'destroy']);

<<<<<<< HEAD
        Route::get('announcement/link', [AnnouncementController::class, 'presignedUpload']);
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
        Route::get('announcement', [AnnouncementController::class, 'index']);
        Route::get('announcement/{id}', [AnnouncementController::class, 'show']);
        Route::post('announcement', [AnnouncementController::class, 'store']);
        Route::put('announcement/{id}', [AnnouncementController::class, 'update']);
        Route::put('announcement/{id}/published', [AnnouncementController::class, 'published']);
        Route::delete('announcement/{id}', [AnnouncementController::class, 'destroy']);

        Route::get('home/total-staff-student', [HomeController::class, 'totalStaffAndStudent']);
    });

    Route::group(['middleware' => ['role:IA']], function () {
        Route::get('staff', [StaffController::class, 'index']);
        Route::get('staff/{id}', [StaffController::class, 'show']);
        Route::post('staff', [StaffController::class, 'store']);
        Route::put('staff/{id}', [StaffController::class, 'update']);
        Route::delete('staff/{id}', [StaffController::class, 'destroy']);
    });

    Route::group(['prefix' => 'students', 'middleware' => ['role:ST']], function () {
        Route::get('notifications', [StudentPageController::class, 'notifications']);
        Route::get('notifications/{id}', [StudentPageController::class, 'showNotifications']);
        Route::get('notifications/read/all', [StudentPageController::class, 'markAllAsReadNotifications']);

        Route::get('news', [StudentPageController::class, 'news']);
        Route::get('news/{news:slug}', [StudentPageController::class, 'showNews']);

        Route::get('exams-live', [StudentPageController::class, 'liveExams']);
        Route::get('exams-recommended', [StudentPageController::class, 'recommendedExams']);
        Route::get('exams-attempted', [StudentPageController::class, 'attemptedExams']);
        Route::get('exams-previous', [StudentPageController::class, 'previousExams']);
        Route::get('exams-upcoming', [StudentPageController::class, 'upcomingExams']);
        Route::get('exams-graph', [StudentPageController::class, 'graphExams']);
        Route::get('exams-preferred', [StudentPageController::class, 'preferredExams']);
        Route::get('exams/{exam:slug}', [StudentPageController::class, 'showExams']);
        Route::get('exams/{exam:slug}/result/{id}', [StudentPageController::class, 'showExamResult']);
        Route::get('exams/{exam:slug}/result-temp/{id}', [StudentPageController::class, 'showExamResultTemp']);
        Route::get('exams/{exam:slug}/result/{id}/analysis', [StudentPageController::class, 'showExamResultAnalysis']);
        Route::post('exams/{exam:slug}', [ResultController::class, 'storeExams']);
        Route::post('exams-question/{exam:slug}', [ResultController::class, 'storeExamsQuestion']);
<<<<<<< HEAD
        // new
        Route::get('exams/{exam:slug}/result/{id}/details', [StudentPageController::class, 'showExamResultDetails']);
        // Route::get('exams/result/{id}', [StudentPageController::class, 'showExamResultDetails']);
        // end new
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

        Route::get('practices', [StudentPageController::class, 'practices']);
        Route::get('practices-attempted', [StudentPageController::class, 'attemptedPractices']);
        Route::get('practices/{practice:slug}', [StudentPageController::class, 'showPractices']);
        Route::get('practices/{practice:slug}/result/{id}', [StudentPageController::class, 'showPracticeResult']);
        Route::get('practices/{practice:slug}/result-temp/{id}', [StudentPageController::class, 'showPracticeResultTemp']);
        Route::get('practices/{practice:slug}/result/{id}/analysis', [StudentPageController::class, 'showPracticeResultAnalysis']);
        Route::post('practices/{practice:slug}', [ResultController::class, 'storePractices']);
        Route::post('practices-question/{practice:slug}', [ResultController::class, 'storePracticesQuestion']);

        Route::get('quizzes', [StudentPageController::class, 'quizzes']);
        Route::get('quizzes-live', [StudentPageController::class, 'liveQuizzes']);
        Route::get('quizzes-attempted', [StudentPageController::class, 'attemptedQuizzes']);
        Route::get('quizzes/{quiz:slug}', [StudentPageController::class, 'showQuizzes']);
        Route::get('quizzes/{quiz:slug}/result/{id}', [StudentPageController::class, 'showQuizResult']);
        Route::get('quizzes/{quiz:slug}/result-temp/{id}', [StudentPageController::class, 'showQuizResultTemp']);
        Route::get('quizzes/{quiz:slug}/result/{id}/rank', [StudentPageController::class, 'showQuizRank']);
        Route::post('quizzes/{quiz:slug}', [ResultController::class, 'storeQuizzes']);
        Route::post('quizzes-question/{quiz:slug}', [ResultController::class, 'storeQuizzesQuestion']);

        Route::get('institutes', [StudentPageController::class, 'institutes']);
        Route::get('institutes/proposal', [StudentPageController::class, 'proposallistInstitute']);
        Route::get('institutes/{instituteId}/branches/{branchId}/batches', [StudentPageController::class, 'batches']);
        Route::post('institutes/join', [StudentPageController::class, 'joinInstitute']);

        Route::get('preferreds', [StudentPageController::class, 'preferreds']);
        Route::post('preferreds', [StudentPageController::class, 'savePreferreds']);

        Route::get('enrollment/check', [StudentPageController::class, 'checkEnrollment']);
    });
});
