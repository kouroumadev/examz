<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamResultDetailOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_result_detail_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_result_detail_id')->constrained('exam_result_details')->onDelete('cascade');
            $table->foreignId('exam_option_id')->constrained('exam_options')->onDelete('cascade');
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
        Schema::dropIfExists('exam_result_detail_options');
    }
}
