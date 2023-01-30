<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamQuestionItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_question_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_question_id')->constrained('exam_questions')->onDelete('cascade');
            $table->enum('level', ['easy', 'medium', 'hard']);
            $table->string('tag');
            $table->longText('question');
<<<<<<< HEAD
            $table->enum('answer_type', ['single', 'multiple', 'numeric']);
=======
            $table->enum('answer_type', ['single', 'multiple']);
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
            $table->longText('answer_explanation');
            $table->float('mark');
            $table->float('negative_mark');
            $table->boolean('is_first_item')->default(false);
<<<<<<< HEAD
            $table->string('is_required')->nullable();
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exam_question_items');
    }
}
